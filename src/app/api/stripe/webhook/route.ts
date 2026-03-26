import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  const stripe = getStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.upsert({
      where: { userId: session.metadata?.userId as string },
      update: {
        stripeId: subscription.id,
        status: subscription.status,
        plan: "premium",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        userId: session.metadata?.userId as string,
        stripeId: subscription.id,
        status: subscription.status,
        plan: "premium",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.subscription.updateMany({
      where: { stripeId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  return NextResponse.json({ received: true });
}
