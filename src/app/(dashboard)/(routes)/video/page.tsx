import React from "react";

import { db } from "@/lib/db";

import { VideoReactPlayer } from "./_compoments/video-react-player";

const VideoPage = async () => {
  const videos = await db.chapter.findFirst({
    where: {
      id: "c0ec3e4b-96da-4837-9844-98b9fe9c7a18",
    },
  });

  if (!videos) return null;

  return (
    <div className="flex flex-col inset-0 w-full min-h-full">
      <VideoReactPlayer url={videos.videoUrl!} />
    </div>
  );
};

export default VideoPage;
