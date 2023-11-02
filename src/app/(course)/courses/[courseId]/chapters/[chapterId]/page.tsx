import React from "react";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButon } from "./_components/course-progress-button";
import { VideoReactPlayer } from "./_components/video-react-player";

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
    doneAllChapterVideos,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return null;

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          labelEn="You already completed this chapter"
          labelId="Anda sudah menyelesaikan bab ini"
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          labelEn="You need this purchase this course to watch this chapter"
          labelId="Anda perlu membeli kursus ini untuk menonton bab ini"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col mx-auto max-w-4xl pb-20">
        <div className="p-4">
          {/* <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          /> */}
          <VideoReactPlayer
            url={chapter.videoUrl!}
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            doneAllChapterVideos={doneAllChapterVideos}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            <CourseProgressButon
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.desc!} />
        </div>
        {!!attachments?.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  key={attachment.id}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center p-3 w-full bg-sky-200 text-sky-700 border rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
