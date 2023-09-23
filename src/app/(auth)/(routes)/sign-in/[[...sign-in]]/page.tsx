import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
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
  );
}
