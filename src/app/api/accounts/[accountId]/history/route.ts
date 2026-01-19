import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { accountId: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { accountId } = await params;

    const balances = await prisma.accountBalance.findMany({
      where: {
        accountId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        account: {
          select: {
            name: true,
            nickname: true,
            type: true,
            subtype: true,
          },
        },
      },
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error("Error fetching account history:", error);
    return NextResponse.json(
      { error: "Failed to fetch account history" },
      { status: 500 }
    );
  }
}
