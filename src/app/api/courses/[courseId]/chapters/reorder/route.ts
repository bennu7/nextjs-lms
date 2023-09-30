import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

    if (!userId)
      return new NextResponse("Unauthorized Permission", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("Unauthorized OWNER COURSE", { status: 401 });

    for (const item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse("Success update reorder", { status: 200 });
  } catch (err: any) {
    console.error("COURSE CHAPTERS REORDER ERR PUT : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
