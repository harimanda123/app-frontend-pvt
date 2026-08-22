"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6">
      <SignIn forceRedirectUrl="/" />
    </div>
  );
}
