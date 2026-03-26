import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL));
  }

  try {
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email
    );

    if (checkoutSession.url) {
      return NextResponse.redirect(checkoutSession.url);
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
