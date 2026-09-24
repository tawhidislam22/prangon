"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createWorkspaceAction } from "@/app/(dashboardLayout)/workspaces/create/_action";
import { setActiveWorkspaceAction } from "@/app/owner/workspaceActions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ICreateWorkspacePayload, createWorkspaceZodSchema } from "@/zod/workspace.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateWorkspaceForm = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync , isPending} = useMutation({
        mutationFn : (payload : ICreateWorkspacePayload) => createWorkspaceAction(payload),
    })

    const form = useForm({
        defaultValues : {
            name: "",
            slug : "",
        },

        onSubmit : async ({value}) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;

                if(!result.success ){
                    setServerError(result.message || "Failed to create workspace");
                    return ;
                }
                
                await setActiveWorkspaceAction(value.slug);
                router.push(`/owner/dashboard`);
            } catch (error : any) {
                console.log(`Failed to create workspace: ${error.message}`);
                setServerError(`Failed to create workspace: ${error.message}`);
            }
        }
    })
  return (
    <Card className="w-full max-w-md mx-auto shadow-md mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create a Workspace</CardTitle>
        <CardDescription>
          Enter a name and unique slug for your new workspace.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: createWorkspaceZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Workspace Name"
                type="text"
                placeholder="e.g. My Company"
              />
            )}
          </form.Field>

          <form.Field
            name="slug"
            validators={{ onChange: createWorkspaceZodSchema.shape.slug }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Workspace Slug"
                type="text"
                placeholder="e.g. my-company"
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Creating...." disabled={!canSubmit}>
                Create Workspace
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateWorkspaceForm
