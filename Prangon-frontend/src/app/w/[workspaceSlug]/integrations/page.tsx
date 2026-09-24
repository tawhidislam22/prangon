import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  MessageSquare,
  HardDrive,
  Trello,
  Figma,
  Webhook,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default async function WorkspaceIntegrationsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  const integrations = [
    {
      id: "github",
      name: "GitHub",
      description: "Link commits and pull requests directly to project tasks and milestones.",
      icon: Github,
      status: "Connected",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      buttonText: "Configure",
      actionVariant: "outline" as const,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Receive instant notifications for task assignments, status changes, and mentions.",
      icon: MessageSquare,
      status: "Available",
      badgeColor: "bg-slate-100 text-slate-700 border-line",
      buttonText: "Connect Slack",
      actionVariant: "default" as const,
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Attach documents, spreadsheets, and presentation files to workspace tasks.",
      icon: HardDrive,
      status: "Available",
      badgeColor: "bg-slate-100 text-slate-700 border-line",
      buttonText: "Connect Drive",
      actionVariant: "default" as const,
    },
    {
      id: "jira",
      name: "Jira Software",
      description: "Bi-directionally sync sprints, epics, and engineering issues with Prangon.",
      icon: Trello,
      status: "Available",
      badgeColor: "bg-slate-100 text-slate-700 border-line",
      buttonText: "Connect Jira",
      actionVariant: "default" as const,
    },
    {
      id: "figma",
      name: "Figma",
      description: "Embed live interactive UI frames and mockups inside task discussion threads.",
      icon: Figma,
      status: "Available",
      badgeColor: "bg-slate-100 text-slate-700 border-line",
      buttonText: "Connect Figma",
      actionVariant: "default" as const,
    },
    {
      id: "webhooks",
      name: "Custom Webhooks",
      description: "Trigger outbound HTTP POST requests to your internal services upon task completion.",
      icon: Webhook,
      status: "Available",
      badgeColor: "bg-slate-100 text-slate-700 border-line",
      buttonText: "Add Webhook",
      actionVariant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Integrations & Connected Apps"
        description="Supercharge your workspace by syncing data with your favorite engineering and design tools."
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Integrations" },
        ]}
        badge={
          <Badge variant="outline" className="bg-cobalt/10 text-cobalt border-cobalt/20 font-semibold text-[11px]">
            6 Available
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const Icon = item.icon;
          const isConnected = item.status === "Connected";

          return (
            <Card
              key={item.id}
              className="border border-line bg-white shadow-xs hover:border-cobalt/40 transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="size-10 rounded-lg bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-sm shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-semibold ${item.badgeColor}`}>
                    {isConnected && <CheckCircle2 className="size-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold font-display text-ink mt-3">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-xs text-graphite line-clamp-2 mt-1 min-h-[32px]">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-5 pt-2">
                <Button
                  variant={item.actionVariant}
                  size="sm"
                  className={`w-full text-xs font-semibold gap-1.5 ${
                    item.actionVariant === "default"
                      ? "bg-cobalt hover:bg-cobalt/90 text-white shadow-xs"
                      : "border-line"
                  }`}
                >
                  <span>{item.buttonText}</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
