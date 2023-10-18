import React from "react";
import { auth } from "@clerk/nextjs";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";

import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) return null;

  const {
    chapter,
    attachments,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return null;

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label="You need this purchase this course to watch this chapter"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col mx-auto max-w-4xl pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
