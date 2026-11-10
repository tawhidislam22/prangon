"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(auth)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Building2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RegisterFormProps {
    redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync , isPending} = useMutation({
        mutationFn : (payload : IRegisterPayload) => registerAction(payload, redirectPath),
    })

    const form = useForm({
        defaultValues : {
            role: "MEMBER",
            name: "",
            email : "",
            password : "",
        },

        onSubmit : async ({value}) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;

                if(!result.success ){
                    setServerError(result.message || "Registration failed");
                    return ;
                }
            } catch (error : any) {
                console.log(`Registration failed: ${error.message}`);
                setServerError(`Registration failed: ${error.message}`);
            }
        }
    })
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border border-border bg-card text-card-foreground relative z-20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details to register.
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
          <form.Field name="role" validators={{ onChange: registerZodSchema.shape.role }}>
            {(field) => (
              <div className="space-y-1.5 pb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Register as
                </label>
                <div className="grid grid-cols-2 p-1 bg-muted/50 rounded-xl border border-border gap-1">
                  <button
                    type="button"
                    onClick={() => field.handleChange("OWNER")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      field.state.value === "OWNER"
                        ? "bg-card text-foreground shadow-xs border border-border font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <Building2 className="size-4" />
                    <span>Owner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => field.handleChange("MEMBER")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      field.state.value === "MEMBER"
                        ? "bg-card text-foreground shadow-xs border border-border font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <Users className="size-4" />
                    <span>Member</span>
                  </button>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                type="text"
                placeholder="Enter your name"
                autoComplete="off"
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-graphite hover:text-ink cursor-pointer hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
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
              <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Registering...." disabled={!canSubmit}>
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
            <Link
                href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                className="text-primary font-medium hover:underline underline-offset-4"
            >
                Log In
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegisterForm
