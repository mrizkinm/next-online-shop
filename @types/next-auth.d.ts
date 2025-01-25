import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  }

  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  }

  interface JWT {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  }
}