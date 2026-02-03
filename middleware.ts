import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (token) return true;
        return false;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
