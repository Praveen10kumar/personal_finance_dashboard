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