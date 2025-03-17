"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image";
import toast from "react-hot-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/shop-store";
import Link from "next/link";

const RagisterPage = () => {
  const formSchema = z.object({
    email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    address: z.string().min(5, { message: "Address is required" }),
    phone: z.string().min(10, { message: "Phone number is required" }),
    password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
  });

  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const { storeInfo } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      address: '',
      phone: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Register success');
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        handleError(responseData.errors);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-slate-900 shadow-lg rounded-lg mx-5 my-6">
        <div className="flex flex-col space-y-2 items-center">
          <Image src={storeInfo?.image || '/img/default.jpg'} alt={storeInfo?.name || 'Store Image'} width={150} height={50} />
          {/* <h1 className="text-2xl font-semibold tracking-tight">{storeInfo.name}</h1> */}
          <p className="text-sm text-muted-foreground">Enter your information</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
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

            {/* Form Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      className="w-full"
                    />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </Button>
          </form>
        </Form>
        <div>
          <p className="text-sm text-center">
            Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RagisterPage