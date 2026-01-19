import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { accountId: string; balanceId: string };

export async function DELETE(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { accountId, balanceId } = await params;

    // Verify the balance record belongs to the specified account
    const balance = await prisma.accountBalance.findFirst({
      where: {
        id: balanceId,
        accountId: accountId,
      },
    });

    if (!balance) {
      return NextResponse.json(
        { error: "Balance record not found" },
        { status: 404 }
      );
    }

    // Delete the balance record
    await prisma.accountBalance.delete({
      where: {
        id: balanceId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting balance record:", error);
    return NextResponse.json(
      { error: "Failed to delete balance record" },
      { status: 500 }
    );
  }
}
