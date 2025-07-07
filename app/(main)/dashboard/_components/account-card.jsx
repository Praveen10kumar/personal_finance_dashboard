"use client";

import { updateDefaultAccount } from '@/actions/accounts';
import useFetch from '@/hooks/use-fetch';
import { Link } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const AccountCard = ({ account }) => {
    const {name, type, balance,id, isDefault} = account;

    const { data: updatedAccount, error, fetchData: updateAccount, setLoading: UpdateDefaultLoading } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("This account is already set as default.");
            return;
        }

        
        await updateAccount(id);
       
    }

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully!");
        }
    }, [updatedAccount, UpdateDefaultLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error updating default account. ");
        }
    }, [error]);

  return (
    <Card className='relative hover:shadow-md transition-shadow group'>
        <Link href={`/accounts/${id}`} className='absolute top-2 right-2 text-muted-foreground hover:text-primary transition-colors'>
            <CardHeader className='flex items-center justify-between space-y-2 pb-2'>
                <CardTitle className='text-sm font-medium capitalize'>{name}</CardTitle>
                <Switch checked={isDefault} onClick={handleDefaultChange} disabled={UpdateDefaultLoading} />
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold mb-2'>
                    ${parseFloat(balance).toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground'>
                    {type.charAt(0) + type.slice(1).toLowerCase()} Account
                </p>
            </CardContent>
            <CardFooter className='flex justify-between text-sm text-muted-foreground'>
                <div className='flex items-center'>
                    <ArrowUpRight className='h-4 w-4 mr-1 text-green-500' />
                    Income
                </div>
                <div className='flex items-center'>
                    <ArrowDownRight className='h-4 w-4 mr-1 text-red-500' />
                    Expense
                </div>
            </CardFooter>
        </Link>
    </Card>
  )
}

export default AccountCard
