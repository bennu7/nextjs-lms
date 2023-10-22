import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    const { isCompleted } = await req.json();

    if (!userId)
      return new NextResponse("Unauthorized Permission", { status: 401 });

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return new NextResponse(JSON.stringify(userProgress), {
      status: 200,
    });
  } catch (err: any) {
    console.error("COURSE PROGRESS CHAPTERS_ID ERR PUT : ", err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
