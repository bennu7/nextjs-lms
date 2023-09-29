import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized Permission", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return new NextResponse(JSON.stringify(course), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSES ERR GET : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
