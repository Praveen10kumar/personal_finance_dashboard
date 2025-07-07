import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET() {
    const result = await seedTransactions();
    return new Response(JSON.stringify(result));
}