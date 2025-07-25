import { getAccountWithTransactions } from '@/actions/accounts'
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'
import TransactionTable from '../_components/transaction-table'
import AccountChart from '../_components/account-chart'

const AccountsPage = async ({params}) => {
  const accountData = await getAccountWithTransactions(params.id);

    if (!accountData) {
        return <div className='text-center text-red-500'>Account not found</div>
    }

    const { transactions, ...account } = accountData;

  return (
    <div className='px-5 space-y-8 '>
      <div className='flex gap-4 items-end justify-between'>
        <div>
            <h1 className='text-4xl sm:text-5xl font-bold gradient-title capatalize mb-4'>{account.name}</h1>
            <p className='text-muted-foreground'>{account.type.charAt(0) + account.type.slice(1).toLowerCCase()}</p>
        </div>

        <div className='text-right pb-2'>
            <div className='text-xl sm:text-2xl font-bold'>${parseFloat(account.balance).toFixed(2)}</div>
            <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions</p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
        <Suspense
          fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
        >
          <TransactionTable transactions={transactions} />
        </Suspense>

    </div>
  )
}

export default AccountsPage() 
