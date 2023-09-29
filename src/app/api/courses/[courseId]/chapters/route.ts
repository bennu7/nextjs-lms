import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized Permission", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("Unauthorized OWNER COURSE", { status: 401 });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title: values.title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return new NextResponse(JSON.stringify(chapter), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSE CHAPTERS ERR POST : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
