"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return <Toaster />;
};

export { ToasterProvider };
