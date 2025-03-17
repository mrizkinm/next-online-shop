'use client'

import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from './components/order-list';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import Profile from './components/profile';
import { useErrorHandler } from '@/hooks/use-error-handler';

const AccountPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchOrders = async (customerId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${customerId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.token}`
          }
        });
        const responseData = await response.json();
        
        if (response.ok) {
          setOrders(responseData.data);
        } else {
          // Menampilkan error toast untuk setiap field yang gagal
          handleError(responseData.errors);
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders(user.id.toString());
    }
  }, [user?.id, session?.token, handleError]);

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">
            My Account
          </p>
        </div>
        <Separator />
        <div className="space-y-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">My Account</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              {
                loading
                ? <ProfileSkeleton />
                : <Profile user={user} />
              }
            </TabsContent>
            <TabsContent value="orders" >
              {
                loading
                ? <OrderListSkeleton />
                : <Orders orders={orders} />
              }
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <Card>
      <div>
        <div className="flex flex-col items-center space-y-6 p-6 pb-2">
          <div className="relative">
            {/* Avatar Skeleton */}
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="absolute bottom-0 right-0 h-8 w-8 rounded-full" />
          </div>

          {/* Tabs Skeleton */}
          <div className="grid w-full max-w-md grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>

        <CardContent className="pt-4">
          <div>
            <div className="space-y-4">
              {/* Form Fields Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              {/* Submit Button Skeleton */}
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-6 w-[80px]" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default AccountPage