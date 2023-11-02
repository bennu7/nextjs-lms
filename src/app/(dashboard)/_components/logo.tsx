"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      className="hover:cursor-pointer hover:opacity-80"
      src="/logo.svg"
      alt="logo"
      width={100}
      height={100}
      onClick={() => {
        router.push("/");
      }}
    />
  );
};

export { Logo };
