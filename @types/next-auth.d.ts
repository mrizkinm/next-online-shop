import "next-auth";

declare module "next-auth" {
  interface User {
    token?: string;
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  }

  interface Session {
    token?: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  }
}