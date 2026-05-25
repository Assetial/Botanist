import { Suspense } from "react";
import { UnlockForm } from "@/components/unlock-form";

export default function UnlockPage() {
  return (
    <div className="py-10">
      <Suspense>
        <UnlockForm />
      </Suspense>
    </div>
  );
}