"use client";

import React, { Suspense } from 'react'
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarLoader } from 'react-spinners';
import { serializeTransaction } from '@/actions/accounts'
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { Checkbox } from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { categoryColors } from './data/category-colors';


const TransactionTable = ({ transactions }) => {

    const filteredAndSortedTransactions = transactions;

    const handleSort = (column) => {
        // Implement sorting logic here
    }

  return (
    <div className='px-5 space-y-4'>
      {/*Filters*/}

      {/*Transactions */}
      <div className='rounded-md border'>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">
                    <Checkbox />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className='flex items-center'>Date</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                    <div className='flex items-center'>Description</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                    <div className='flex items-center'>Category</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className='flex items-center justify-end'>Amount</div>
                </TableHead>
                <TableHead>
                    recurring
                </TableHead>
                <TableHead className='w-[50px]'/>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAndSortedTransactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No transactions found
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredAndSortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                                <Checkbox />
                            </TableCell>
                            <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="capitalize">
                                <span style={{ color: categoryColors[transaction.category] }} className='px-2 py-1 rounded text-sm text-white'>
                                    {transaction.category}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-medium" style={{ color: transaction.type === 'EXPENSE' ? 'red' : 'green' }}>
                                {transaction.type === 'EXPENSE' ? '-' : '+'}
                                ${transaction.amount.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
      </div>

    </div>
  )
}

export default TransactionTable
