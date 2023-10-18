import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";

const { Video, Data } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

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

    const updated = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        Video.Assets.del(existingMuxData.assetId).catch((err) => {
          console.error(
            "Mux Video Assets Delete Error | 404 Not Found : ",
            err
          );
        });
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset?.playback_ids?.[0]?.id || "",
          chapterId: params.chapterId,
        },
      });
    }

    return new NextResponse(JSON.stringify(updated), { status: 200 });
  } catch (err: any) {
    console.error("COURSE CHAPTERS_ID ERR PATCH : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId).catch((err) => {
          console.error(
            "Mux Video Assets Delete Error | 404 Not Found : ",
            err
          );
        });

        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChapersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return new NextResponse("SUCCESS DELETED CHAPTER", { status: 200 });
  } catch (err: any) {
    console.error("COURSE CHAPTERS_ID ERR DELETE : ", err);
    return new NextResponse(
      `Internal Server Error, ${JSON.stringify(err.message || err)}`,
      { status: 500 }
    );
  }
}
