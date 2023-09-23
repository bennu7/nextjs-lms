import React from "react";
import Image from "next/image";

const Logo = () => {
  return <Image src="/logo.svg" alt="logo" width={100} height={100} />;
};

export { Logo };
