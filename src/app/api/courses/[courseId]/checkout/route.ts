import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

interface CheckoutParams {
  params: {
    courseId: string;
  };
}

export async function POST(req: NextRequest, { params }: CheckoutParams) {
  try {
    console.log("MASOOKK");

    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress)
      return new NextResponse("Unauthorized Permission", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
        // userId: user.id,
      },
    });

    if (!course) return new NextResponse("NOT FOUND COURSE", { status: 404 });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) return new NextResponse("Already Purchased", { status: 400 });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
            images: [course.imageUrl!],
          },
          unit_amount: Math.round(course.price!) * 100,
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      //   payment_method_types: ["card"],
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("COURSE CHECKOUT CHAPTERS_ID ERR POST : ", err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
