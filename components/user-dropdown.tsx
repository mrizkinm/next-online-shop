'use client';

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/cart-store';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const UserDropdown = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { resetCartSession } = useCart();
  const router = useRouter();

  const onLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });
      
      const responseData = await response.json();

      if (response.ok) {
        resetCartSession();
        // Redirect to dashboard or other protected page on success
        await signOut({
          redirect: false
        });
        router.push("/login");
      } else {
        toast.error(responseData);
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  };

  if (!user) return (
    <Link href="/login" title="Login" className={cn(buttonVariants({ variant: "ghost" }), "relative border h-9 w-9 rounded-full")}>
      <User />
    </Link>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" title="Profile" className="relative border h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>{user?.name.split(' ').map((word: string) => word[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/account`}>
            <DropdownMenuItem className="cursor-pointer">
              Account
              <DropdownMenuShortcut><User size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/cart`}>
            <DropdownMenuItem className="cursor-pointer">
              Cart
            <DropdownMenuShortcut><ShoppingCart size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => onLogout()}>
          Log out
          <DropdownMenuShortcut><LogOut size={16} /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown