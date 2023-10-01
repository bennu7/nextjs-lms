"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
// import "@uploadthing/react/styles.css" // *import to globals.css

import { UploadDropzone, UploadButton, Uploader } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}
const FileUpload: React.FC<FileUploadProps> = ({ endpoint, onChange }) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return (
    <UploadDropzone
      // content={{
      //   button({ ready }) {
      //     if (ready) return <div>Upload image</div>;

      //     return "Getting ready...";
      //   },
      //   allowedContent({ ready, fileTypes }) {
      //     if (!ready) return "Checking what you allow";
      //     // if (isUploading) return "Seems like stuff is uploading";
      //     return `You just can upload file : ${fileTypes.join(", ")}`;
      //   },
      // }}
      className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
      onUploadError={(err: Error) => {
        toast.error(`Failed to upload file, detail: ${err.message}`);
      }}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      endpoint={endpoint}
    />
  );
};

export { FileUpload };
