import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    '/customer/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/api/order/:path*',
    '/api/user/password',
    '/api/user/profile'
  ],
};
