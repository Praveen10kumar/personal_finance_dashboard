"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { se, tr } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { Select } from "react-day-picker";

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

export async function createAccount(data) {
    try {
        const {userId} = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        //convert balance to float before saving it
        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)) {
            throw new Error("Invalid balance value");
        }

        const existingAccount = await db.account.findMany({
            where: {userId: user.id},
        });

        const shouldBeDefault = existingAccount.length === 0? true : data.isDefault;

        if(shouldBeDefault) {
            // Set all other accounts to not default
            await db.account.updateMany({
                where: {userId: user.id, isDefault: true},
                data: {isDefault: false},
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            }
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return {success : true, data: serializedAccount};
    } catch (error) {
        console.error("Error creating account:", error);
        throw new Error("Failed to create account");
    }
}

export async function getAccounts() {
    try {
        const {userId} = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const accounts = await db.account.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
            include:{
                _count: {
                    Select:{
                        transactions: true,
                    },
                },
            },
        });

        const serializedAccount = accounts.map(serializeTransaction)    ;
        return serializedAccount;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw new Error("Failed to fetch accounts");
    }
}   