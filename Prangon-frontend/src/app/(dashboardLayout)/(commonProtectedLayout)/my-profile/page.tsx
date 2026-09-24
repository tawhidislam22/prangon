import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInfo } from "@/services/auth.services";
import { CalendarDays, CheckCircle2, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";

type Profile = {
  id: string; name: string; email: string; role: string; status?: string;
  emailVerified?: boolean; image?: string | null; createdAt?: string; updatedAt?: string;
};

const formatLabel = (value?: string) => value ? value.toLowerCase().replaceAll("_", " ") : "Not available";
const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value))
  : "Not available";

export default async function MyProfilePage() {
  const user = (await getUserInfo()) as Profile | null;
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">View your personal information and account details.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/80 via-primary to-primary/70" />
        <CardContent className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Avatar className="size-24 border-4 border-card shadow-md">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <Badge variant="secondary" className="capitalize">{formatLabel(user.role)}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button asChild variant="outline"><Link href="/change-password"><KeyRound className="size-4" />Change password</Link></Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Personal information</CardTitle><CardDescription>Your primary account details.</CardDescription></CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <ProfileField icon={UserRound} label="Full name" value={user.name} />
            <ProfileField icon={Mail} label="Email address" value={user.email} />
            <ProfileField icon={ShieldCheck} label="Account role" value={formatLabel(user.role)} capitalize />
            <ProfileField icon={CalendarDays} label="Member since" value={formatDate(user.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Account status</CardTitle><CardDescription>Security and access overview.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <StatusRow label="Account" value={formatLabel(user.status || "active")} positive={(user.status || "ACTIVE") === "ACTIVE"} />
            <StatusRow label="Email" value={user.emailVerified ? "Verified" : "Not verified"} positive={Boolean(user.emailVerified)} />
            <div className="border-t pt-4 text-xs text-muted-foreground">Last updated {formatDate(user.updatedAt)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, capitalize = false }: { icon: typeof UserRound; label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="size-5" /></div>
      <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`mt-1 truncate text-sm font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p></div>
    </div>
  );
}

function StatusRow({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={positive ? "secondary" : "outline"} className="gap-1 capitalize">
        {positive && <CheckCircle2 className="size-3 text-emerald-600" />}{value}
      </Badge>
    </div>
  );
}
