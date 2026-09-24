"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptInvitationAction } from "./_action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const workspaceSlug = searchParams.get("workspace");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No invitation token found in the URL.");
      return;
    }

    const acceptInvite = async () => {
      const result = await acceptInvitationAction(token);
      
      if (result.success) {
        setStatus("success");
        toast.success("Invitation accepted successfully!");
        
        // Wait a brief moment for the user to see the success message
        setTimeout(() => {
          if (workspaceSlug) {
            router.push(`/owner/dashboard`);
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    };

    acceptInvite();
  }, [token, workspaceSlug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Workspace Invitation</CardTitle>
          <CardDescription>
            {status === "loading" && "Processing your invitation..."}
            {status === "success" && "Welcome aboard!"}
            {status === "error" && "Something went wrong"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center py-6 min-h-[160px]">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm font-medium">Please wait while we verify your invitation...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 text-emerald-600">
              <CheckCircle className="size-12" />
              <p className="text-sm font-medium text-center">
                You have successfully joined the workspace. Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 text-destructive">
              <XCircle className="size-12" />
              <p className="text-sm font-medium text-center text-foreground">
                {errorMessage}
              </p>
            </div>
          )}
        </CardContent>

        {status === "error" && (
          <CardFooter className="flex justify-center border-t pt-4">
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
