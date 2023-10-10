import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

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

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChapersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapersInCourse) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return new NextResponse(JSON.stringify(unpublishedChapter), {
      status: 200,
    });
  } catch (err: any) {
    console.error("COURSE UNPUBLISH CHAPTERS_ID ERR PATCH : ", err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
