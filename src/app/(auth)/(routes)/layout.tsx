import React from "react";

interface AuthLayutProps {
  children: React.ReactNode;
}
const AuthLayut: React.FC<AuthLayutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayut;
