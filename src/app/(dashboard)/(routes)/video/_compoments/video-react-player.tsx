"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

interface VideoReactPlayerProps {
  url: string;
}
const VideoReactPlayer: React.FC<VideoReactPlayerProps> = ({ url }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="text-center text-xl text-sky-700 flex flex-col items-center justify-center">
        Loading . . .
      </div>
    );

  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        className="absolute inset-0"
        controls
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
              disablePictureInPicture: true,
            },
          },
        }}
        width="100%"
        height="100%"
        onEnded={() => {}}
        onPlay={() => {}}
      />
    </div>
  );
};

export { VideoReactPlayer };
