"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
// import "react-quill/dist/quill.bubble.css"; //* import to globals.css

interface PreviewProps {
  value: string;
}
const Preview: React.FC<PreviewProps> = ({ value }) => {
  const [mounted, setMounted] = useState(false);
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="bg-white flex flex-col rounded-md">
      <ReactQuill theme="bubble" value={value} readOnly />
    </div>
  );
};

export { Preview };
