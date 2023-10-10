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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) return new NextResponse("Chapter Not Found", { status: 404 });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (!muxData) {
      return new NextResponse("Mux Data Not Found", { status: 404 });
    }

    const pubslishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return new NextResponse(JSON.stringify(pubslishedChapter), {
      status: 200,
    });
  } catch (err: any) {
    console.error("COURSE PUBLISH CHAPTERS_ID ERR PATCH : ", err);
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
}
