// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const adminRoutePattern = /^\/admin\/[0-9]+\/add-project$/;
  const isAdminRoute = adminRoutePattern.test(nextUrl.pathname);

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const userAddress = cookies.get('wallet-address')?.value;
  if (!userAddress) {
    return NextResponse.redirect(new URL('/401', req.url));
  }

  try {
    const response = await fetch(`${req.nextUrl.origin}/api/validate-address?userAddress=${userAddress}`);
    const data = await response.json();

    if (data.isValid) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/401', req.url));
    }
  } catch (error) {
    console.error('Error validating address:', error);
    return NextResponse.redirect(new URL('/401', req.url));
  }
}
