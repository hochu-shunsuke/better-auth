"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      type="button"
      className="mt-4 btn"
      onClick={async () => {
        setLoading(true);
        try {
          await signOut({
            fetchOptions: {
              onSuccess() {
                // navigate to sign-in after successful sign out
                router.push("/sign-in");
              },
              onError() {
                toast.error("Failed to sign out");
              },
            },
          });
        } catch (e) {
          toast.error("Failed to sign out");
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
