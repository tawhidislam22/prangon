import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { cookies } from "next/headers";
import { jwtUtils } from "@/lib/jwtUtils";

interface VerifyEmailParams {
  searchParams: Promise<{ email?: string; redirect?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailParams) => {
  const params = await searchParams;
  let email = params.email || "";

  if (!email) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (accessToken && process.env.JWT_ACCESS_SECRET) {
      const decoded = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
      if (decoded.success && (decoded.data as { email?: string })?.email) {
        email = (decoded.data as { email: string }).email;
      }
    }
  }

  return (
    <VerifyEmailForm initialEmail={email} redirectPath={params.redirect} />
  );
};

export default VerifyEmailPage;