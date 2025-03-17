'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '@/store/cart-store';
import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { Cart } from '@/app/types';

interface ProfileProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "Phone number is required" })
})

const CheckoutForm = ({ 
  total,
  items,
  user
}: { 
  total: number, 
  items: Cart[],
  user: ProfileProps
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      address: user?.address,
      phone: user?.phone
    }
  })
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { removeAllCart } = useCart();
  const { data: session } = useSession();
  const { handleError } = useErrorHandler();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const itemsCheckout = items.map((item: Cart) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
    try {
      // Step 1: Buat pesanan di backend
      const dataOrder = JSON.stringify({
        customerId: user?.id,
        items: itemsCheckout,
        totalAmount: total,
        info: values
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
        method: 'POST',
        body: dataOrder,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });
      const responseData = await response.json();

      if (response.ok) {
        if (session?.token && session?.user?.id) {
          removeAllCart(session.token, session.user.id);
        }
        // Step 3: Tampilkan halaman pembayaran
        window.snap.pay(responseData.snapToken, {
          onSuccess: function (result: unknown) {
            toast.success('Payment success!');
            console.log(result);
            router.push('/account');
          },
          onPending: function (result: unknown) {
            toast.success('Waiting for payment confirmation.');
            console.log(result);
            router.push('/account');
          },
          onError: function (result: unknown) {
            toast.error('Payment failed.');
            console.log(result);
            router.push('/account');
          },
          onClose: function () {
            console.log('Customer closed the popup without finishing the payment');
            router.push('/account');
          },
        });
      } else {
        // Menampilkan error toast untuk setiap field yang gagal
        handleError(responseData.errors);
      }
    } catch (error) {
      console.error('Error handling payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your shipping address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center pt-4">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-xl font-bold">{formatCurrency(total)}</p>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Loading..." : (
              <>
                <CheckCircle /> Place Order
              </>
            )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CheckoutForm