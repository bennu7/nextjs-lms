import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { utapi } from "uploadthing/server";

import { db } from "@/lib/db";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized Permission", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return new NextResponse(JSON.stringify(course), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSES_ID ERR PATCH : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized Permission", { status: 401 });
    }

    const findCourse = await db.course.findFirst({
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
        attachments: true,
      },
    });

    if (!findCourse) {
      return new NextResponse("Course not found", { status: 404 });
    }

    if (findCourse.imageUrl) {
      const nameFile = findCourse.imageUrl.split("/").pop() as string;
      utapi.deleteFiles(nameFile).catch((err) => {
        console.log("- REMOVED FILE findCourse.imageUrl ERR : ", err);
      });
    }

    if (findCourse.attachments.length > 0) {
      for (const attachment of findCourse.attachments) {
        utapi.deleteFiles(attachment.name).catch((err) => {
          console.log("- REMOVED FILE findCourse.attachments ERR : ", err);
        });
      }
    }

    if (findCourse.chapters.length > 0) {
      for (const chapter of findCourse.chapters) {
        if (chapter.videoUrl) {
          const nameFile = chapter.videoUrl?.split("/").pop() as string;
          utapi.deleteFiles(nameFile).catch((err) => {
            console.log("- REMOVED FILE chapter.videoUrl ERR : ", err);
          });
        }

        if (chapter.muxData?.assetId) {
          Video.Assets.del(chapter.muxData.assetId).catch((err) => {
            console.log("- REMOVED MUX ASSET ERR : ", err);
          });
        }
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return new NextResponse(JSON.stringify(deletedCourse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSES_ID ERR DELETE : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
