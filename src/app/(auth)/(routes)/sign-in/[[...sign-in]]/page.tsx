import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome to LMS</h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
              card: "bg-white rounded-md shadow-md p-8 w-96",
            },
            // layout: {
            //   logoPlacement: "outside",
            // },
          }}
        />
      </div>
    </div>
  );
}
