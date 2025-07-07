"use client";

import {useState,React} from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from './ui/drawer';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';


const CreateAccountDrawer = ({children}) => {
  const [open, setOpen] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, setValue,watch,reset } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const { data:newAccount, error, fetchData:fetchNewAccount, setLoading: createAccountLoading } = useFetch(createAccount);

  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success("Account created successfully!");
      reset(); // Reset the form after successful account creation
      setOpen(false); // Close the drawer
    }
  }, [createAccountLoading, newAccount, reset, setOpen]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account.");
    }
  }, [error]);

  const onSubmit = async (data) => {
    await fetchNewAccount(data);
  }; 

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <form action="" className="space-y-4 p-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="name" className=" text-sm font-medium text-gray-700">Account Name</label>
              <Input id ="name" {...register("name")} placeholder="Enter account name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className=" text-sm font-medium text-gray-700">Account Type</label>
              <Select onValueChange={(value) => setValue("type", value)}
                      defaultValue={watch("type")}
              >
                <SelectTrigger id="type" {...register("type")}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">CURRENT</SelectItem>
                  <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className=" text-sm font-medium text-gray-700">Initial Balance</label>
              <Input id ="balance" type="number" step="0.01" {...register("balance")} placeholder="0.00" />
              {errors.balance && <p className="text-red-500 text-sm">{errors.balance.message}</p>}
            </div>

            <div className=" flex items-center justify-between rounded-md border p-4 ">
              <div className="space-y-1">
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">Set as Default</label>
                <p className="text-sm text-muted-foreground">This account will be set as the default account.</p>

              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(value) => setValue("isDefault", value)}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1" disabled={createAccountLoading}>
                {createAccountLoading ?(<Loader2 className="mr-2 h-4 w-4 animate-spin">creating...</Loader2>) : ("Create Account")}
              </Button>
            </div>

          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateAccountDrawer;
