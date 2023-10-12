import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

interface PatchParams {
  params: {
    courseId: string;
    chapterId: string;
  };
}
export async function PATCH(req: NextRequest, { params }: PatchParams) {
  try {
    const { userId } = auth();

    if (!userId)
      return new NextResponse("Unauthorized Permission", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("NOT FOUND COURSE", { status: 404 });

    const hasPublishedChapter = course.chapters.some(
      (chaper) => chaper.isPublished
    );

    if (
      !course.title ||
      !course.imageUrl ||
      !course.description ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields to publish course", {
        status: 401,
      });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return new NextResponse(JSON.stringify(publishedCourse), {
      status: 200,
    });
  } catch (err: any) {
    console.error("COURSE PUBLISH CHAPTERS_ID ERR PATCH : ", err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
