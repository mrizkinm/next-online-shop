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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useStore } from "@/context/store-context";

const LoginPage = () => {
  const formSchema = z.object({
    email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
    password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
  });

  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const { storeInfo } = useStore();
  const publicUrl = process.env.NEXT_PUBLIC_API_URL_PUBLIC;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
        // Jika terjadi error, tampilkan error menggunakan error handler
        handleError(result.error);
      } else if (result?.ok) {
        // Jika login berhasil, arahkan ke halaman dashboard atau halaman yang diinginkan
        toast.success('Login sukses');
        router.push("/");
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-slate-900 shadow-lg rounded-lg mx-5">
        <div className="flex flex-col space-y-2 items-center">
          <Image src={`${publicUrl}/${storeInfo.image}`} alt={storeInfo.name} width={200} height={200} />
          {/* <h1 className="text-2xl font-semibold tracking-tight">{storeInfo.name}</h1> */}
          <p className="text-sm text-muted-foreground">Enter your email and password</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
        <div>
          <p className="text-sm text-center">
            Don't have an account? <Link href="/register" className="text-blue-600">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage