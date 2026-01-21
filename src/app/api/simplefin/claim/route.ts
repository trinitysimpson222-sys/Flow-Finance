import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { claimSetupToken, fetchSimpleFINAccounts, mapSimpleFINAccountType, getAccountMask } from "@/lib/simplefin";

export async function POST(request: Request) {
  try {
    const { setupToken } = await request.json();
    if (!setupToken) return NextResponse.json({ error: "Setup token required" }, { status: 400 });

    const accessUrl = await claimSetupToken(setupToken.trim());
    const response = await fetchSimpleFINAccounts(accessUrl);
    const importedAccounts = [];

    for (const sfAccount of response.accounts) {
      const { type, subtype } = mapSimpleFINAccountType(sfAccount);
      const institutionName = sfAccount.org.name || sfAccount.org.domain;

      let plaidItem = await prisma.plaidItem.findFirst({
        where: { provider: "simplefin", institutionId: sfAccount.org.domain },
      });

      if (!plaidItem) {
        plaidItem = await prisma.plaidItem.create({
          data: {
            itemId: `simplefin_${sfAccount.org.domain}_${Date.now()}`,
            accessToken: accessUrl,
            provider: "simplefin",
            institutionId: sfAccount.org.domain,
            institutionName,
          },
        });
      }

      const account = await prisma.account.create({
        data: {
          plaidId: `simplefin_${sfAccount.id}`,
          name: sfAccount.name,
          type,
          subtype,
          mask: getAccountMask(sfAccount.id),
          itemId: plaidItem.id,
        },
      });

      await prisma.accountBalance.create({
        data: {
          accountId: account.id,
          current: parseFloat(sfAccount.balance),
          available: sfAccount["available-balance"] ? parseFloat(sfAccount["available-balance"]) : null,
          date: new Date(sfAccount["balance-date"] * 1000),
        },
      });

      for (const tx of sfAccount.transactions) {
        await prisma.transaction.upsert({
          where: { accountId_plaidId: { accountId: account.id, plaidId: `simplefin_${tx.id}` } },
          update: { amount: parseFloat(tx.amount), pending: tx.pending || false },
          create: {
            accountId: account.id,
            plaidId: `simplefin_${tx.id}`,
            date: new Date(tx.posted * 1000),
            name: tx.description,
            amount: parseFloat(tx.amount),
            merchantName: tx.payee,
            pending: tx.pending || false,
          },
        });
      }

      importedAccounts.push({ id: account.id, name: account.name, institution: institutionName, balance: parseFloat(sfAccount.balance) });
    }

    return NextResponse.json({ success: true, accounts: importedAccounts, errors: response.errors });
  } catch (error) {
    console.error("SimpleFIN claim error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
