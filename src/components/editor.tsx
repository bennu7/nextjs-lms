"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css"; //* import to globals.css

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}
const Editor: React.FC<EditorProps> = ({ onChange, value }) => {
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
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export { Editor };
