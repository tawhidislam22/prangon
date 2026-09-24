import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function WorkspaceInvoicesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const userInfo = await getUserInfo();

  let members: any[] = [];
  let invoices: any[] = [];
  try {
    const [invRes, memRes] = await Promise.allSettled([
      httpClient.get<any[]>(`/payments/invoices`, {
        params: { workspaceSlug },
      }),
      httpClient.get<any[]>("/workspace-members", {
        params: { workspaceSlug },
      }),
    ]);

    if (memRes.status === "fulfilled") {
      members = memRes.value.data || [];
      const myMembership = members.find(
        (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
        redirect(`/w/${workspaceSlug}/dashboard`);
      }
    }

    invoices = invRes.status === "fulfilled" ? invRes.value.data || [] : [];
  } catch {
    //
  }


  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Invoices & Payment History"
        description="Review all past invoices, payment receipts, and billing statements."
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Billing", href: `/w/${workspaceSlug}/billing` },
          { label: "Invoices" },
        ]}
        badge={
          <Badge variant="outline" className="border-line text-graphite text-[11px] font-semibold">
            {invoices.length} Invoices
          </Badge>
        }
        actions={
          <Link href={`/w/${workspaceSlug}/billing`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-line">
              <ArrowLeft className="size-3.5" />
              <span>Back to Billing</span>
            </Button>
          </Link>
        }
      />

      <Card className="border border-line bg-white shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs font-semibold">
                  <TableHead className="w-[200px]">Invoice Number</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/20 text-xs">
                    <TableCell className="font-semibold text-ink flex items-center gap-2">
                      <FileText className="size-3.5 text-cobalt" />
                      <span>{inv.number || `INV-${inv.id.slice(0, 8).toUpperCase()}`}</span>
                    </TableCell>
                    <TableCell className="text-graphite">
                      {new Date(inv.createdAt || Date.now()).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold text-ink">
                      ${((inv.amount || 0) / 100).toFixed(2)} USD
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase gap-1">
                        <CheckCircle2 className="size-3" />
                        {inv.status || "Paid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.hostedInvoiceUrl ? (
                        <a
                          href={inv.hostedInvoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cobalt hover:underline font-medium"
                        >
                          <Download className="size-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12">
              <EmptyState
                icon={FileText}
                title="No invoices generated yet"
                description="When your workspace makes subscription payments or changes tiers, downloadable receipts will be archived here."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
