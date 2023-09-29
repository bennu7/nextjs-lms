import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { utapi } from "uploadthing/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized OWNER COURSE", { status: 401 });
    }

    const findAttachment = await db.attachment.findUnique({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });
    if (!findAttachment) {
      return new NextResponse("Attachment OR Course ID NOT FOUND", {
        status: 404,
      });
    }

    utapi.deleteFiles(findAttachment.name);

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
      },
    });

    return new NextResponse(JSON.stringify(attachment), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSE ATTACHMENTS ERR DELETE : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
