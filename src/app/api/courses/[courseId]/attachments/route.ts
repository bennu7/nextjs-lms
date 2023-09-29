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

    if (!courseOwner) {
      return new NextResponse("Unauthorized OWNER COURSE", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url: values.url,
        name: (values.url as string).split("/").pop() as string,
        courseId: params.courseId,
        // course: {
        //   connect: {
        //     id: params.courseId,
        //   },
        // },
      },
    });

    return new NextResponse(JSON.stringify(attachment), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("COURSE ATTACHMENTS ERR POST : ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
