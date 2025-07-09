"use client";

import React, { Suspense, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { categoryColors } from './data/category-colors';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge, ChevronDown, ChevronUp, Clock, RefreshCw, Search, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';



const TransactionTable = ({ transactions }) => {

    const router = useRouter();

    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: 'date',
        direction: 'asc',
    });

    const [searchTerm,setSearchTerm] = useState("");
    const [typeFilter,setTypeFilter] = useState("");
    const [recurringFilter,setRecurringFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAndSortedTransactions = useMemo(()=>{
        let result = [...transactions];

        //Applying search filter
        if(searchTerm) {
            const SearchLower = searchTerm.toLoweCase();
            result = result.filter((transactions) => 
                transactions.description?.toLoweCase().includes(SearchLower)
            );
        }

        // Applying type filter
        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
        }

        // Applying recurring filter
        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === "recurring") return transaction.isRecurring;
                return !transaction.isRecurring;
            });
        }

        // Applying sorting filter
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    comparison = 0;
            }

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return result;
    },[
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig,
    ]);

      // Pagination function to control number of transaction o one page
        const totalPages = Math.ceil(
            filteredAndSortedTransactions.length / ITEMS_PER_PAGE
        );
        const paginatedTransactions = useMemo(() => {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            return filteredAndSortedTransactions.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
            );
        }, [filteredAndSortedTransactions, currentPage]);

    const handleSort = (field) => {
        setSortConfig((prevConfig) => ({
            field,
            direction: 
                current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    }

    const handleSelect = (id) =>{
        setSelectedIds(current=>current.includes(id)?current.filter(item=>item!=id):[...current,id])
    }

    const handleSelectAll = () =>{
        setSelectedIds(current.length === filteredAndSortedTransactions
            ?[]
            :filteredAndSortedTransactions.map(t=>t.id))
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedIds([]); // Clear selections on page change
    };

    const RECURRING_INTERVALS = {
        DAILY: 'Daily',
        WEEKLY: 'Weekly',
        MONTHLY: 'Monthly',
        YEARLY: 'Yearly',
    }

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions);

    const handleBulkDelete = async () => {
        if (
        !window.confirm(
            `Are you sure you want to delete ${selectedIds.length} transactions?`
        )
        )
        return;

        deleteFn(selectedIds);
    };

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
        }
    }, [deleted, deleteLoading]);

    const handleClearFilters = () =>{
        setSearchTerm("");
        setRecurringFilter("");
        setTypeFilter("");
        setSelectedIds([]);
    }

  return (
    <div className='px-5 space-y-4'>
        {deleteLoading && (
            <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
        )}

      {/*Filters*/}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
            <Input 
                placeholder ="Search transactions..."
                value = {searchTerm}
                onChange = {(e) =>  {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className='pl-8'/>
        </div>
        <div className='flex gap-2'>
            <Select type={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>
                <SelectTrigger >
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
            </Select>

            <Select type={recurringFilter} onValueChange={(value) => {
                setRecurringFilter(value)
                setCurrentPage(1);
            }}>
                <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recurring">Recurring only</SelectItem>
                    <SelectItem value="non-recurring">Non-recurring only</SelectItem>
                </SelectContent>
            </Select>

            {selectedIds.length>0 && <div>
                <Button variant = "destructive" size = "sm" onClick = {handleBulkDelete}>
                    <Trash className='h-4 w-4 mr-2'/>
                    Delete Selected ({selectedIds.length})
                </Button>
            </div>}

            {(searchTerm || typeFilter || recurringFilter) && (
                <Button variant='outline' size='icon' onClick={handleClearFilters} title='Clear Filters'>
                    <X className='h-4 w-4'/>
                </Button>
            )

            }
        </div>
      </div>

      {/*Transactions */}
      <div className='rounded-md border'>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">
                    <Checkbox onCheckedChange = {handleSelectAll} 
                        checked={
                            selectedIds.length === paginatedTransactions.length &&
                            paginatedTransactions.length > 0
                        }
                    />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className='flex items-center'>Date{" "}{sortConfig.field === 'date' && (sortConfig.direction === 'asc') ? <ChevronUp className='ml-1 h-3 w-3'/> : <ChevronDown className='ml-1 h-3 w-3'/>}</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                    <div className='flex items-center'>Description</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                    <div className='flex items-center'>Category{sortConfig.field === 'category' && (sortConfig.direction === 'asc') ? <ChevronUp className='ml-1 h-3 w-3'/> : <ChevronDown className='ml-1 h-3 w-3'/>}</div>
                </TableHead>

                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className='flex items-center justify-end'>Amount{sortConfig.field === 'amount' && (sortConfig.direction === 'asc') ? <ChevronUp className='ml-1 h-3 w-3'/> : <ChevronDown className='ml-1 h-3 w-3'/>}</div>
                </TableHead>
                <TableHead>
                    recurring
                </TableHead>
                <TableHead className='w-[50px]'/>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedTransactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No transactions found
                        </TableCell>
                    </TableRow>
                ) : (
                    paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                                <Checkbox onCheckedChange ={()=>handleSelect(transaction.id)}
                                    checked={selectedIds.includes(transaction.id)}
                                />
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
                            <TableCell>
                                {transaction.isRecurring ? (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge variant="outline" className='gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200'>
                                                <RefreshCw className='h-3 w-3' />
                                                {RECURRING_INTERVALS[transaction.recurringInterval] || 'Custom'}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className='text-sm'>
                                                <div className='font-medium'>Next-Date</div>
                                                <div>{format(new Date(transaction.nextRecurringDate), 'PP')}</div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Badge variant="outline" className='gap-1'>
                                        <Clock className='h-3 w-3' />
                                        One-time
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className='h-4 w-4' /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onclick={() => 
                                                router.push(`transactions/edit=${transaction.id}`)
                                            }
                                        >
                                            Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive"
                                            onClick ={() => 
                                                deleteFn([transaction.id])
                                            }
                                        >
                                            Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>

                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

    </div>
  )
}

export default TransactionTable
