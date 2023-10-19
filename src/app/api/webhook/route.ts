import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("WEBHOOK ERR POST : ", err);
    return new NextResponse(`Webhook Error: ${err.message || err}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId)
      return new NextResponse("Webhook Error: Missing metadata", {
        status: 400,
      });

    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return new NextResponse(
      `Webhook Stripe Error: Invalid event type: ${event.type}`,
      {
        status: 200, // why 200? because stripe will keep trying to send the webhook until it gets a 200
      }
    );
  }

  return new NextResponse(null, {
    status: 200,
  });
}
