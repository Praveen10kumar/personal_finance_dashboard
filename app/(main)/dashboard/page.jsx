import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

async function DashboardPage() {

  const accounts = await getAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className='px-5'>

        {/*Budget progress*/}
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />

        {/*overview*/}
        <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

        {/*Accounts grid*/}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <CreateAcountDrawer>
                <Card className='flex flex-col items-center justify-center h-48 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                  <CardContent className='flex flex-col items-center justify-center h-full text-muted-foreground pt-5'>
                    <Plus className='h-10 w-10 mb-2' />
                    <p className='text-sm font-medium text-gray-500'>Create Account</p>
                  </CardContent>
                </Card>
            </CreateAcountDrawer>

            {accounts.length > 0 ? accounts.map((account) => {
                return <AccountCard key={account.id} account={account} />
            }) : (
                <p className='text-gray-500'>No accounts found</p>
            )}
        </div>
    </div>
  )
}

export default DashboardPage


