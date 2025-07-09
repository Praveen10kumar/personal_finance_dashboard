"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; 



const serializeTransaction = (transaction) => {
    const serialized = {...transaction };
    
    if(transaction.balance) {
        serialized.balance = transaction.balance.toNumber();
    }

    if(transaction.amount) {
        serialized.amount = transaction.amount.toNumber();
    }

    return serialized;
};

export async function updateDefaultAccount(accountId) {
    try {
        const {userId} = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        // Set all other accounts to not default
        await db.account.updateMany({
            where: {userId: user.id, isDefault: true},
            data: {isDefault: false},
        });

        // Set the selected account as default
        const account = await db.account.update({
            where: {id: accountId, userId: user.id},
            data: {isDefault: true, userId: user.id},
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return {success : true, data: serializedTransaction(account)};
    } catch (error) {
        console.error("Error updating default account:", error);
        throw new Error("Failed to update default account");
    }
}

export async function getAccountWithTransactions(accountId) {
    try {
        const {userId} = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const account = await db.account.findUnique({
            where: {id: accountId, userId: user.id},
            include: {
                transactions: {
                    orderBy: {createdAt: "desc"},
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        return { 
            ...serializeTransaction(account),
            transactions: account.transactions.map(serializeTransaction),

        };
    } catch (error) {
        console.error("Error fetching account with transactions:", error);
        throw new Error("Failed to fetch account with transactions");
    }
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}