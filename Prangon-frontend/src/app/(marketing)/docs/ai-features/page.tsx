import { DocsLayout } from "@/components/docs/DocsLayout";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "task-suggestions", title: "AI Task Suggestions" },
  { id: "document-analysis", title: "Document Analysis" },
];

export const metadata = {
  title: "AI Features | Prangon Docs",
  description: "Leverage AI to boost productivity with task suggestions and document analysis.",
};

export default function AIFeaturesPage() {
  return (
    <DocsLayout title="AI Features" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>Prangon includes powerful AI capabilities to help you work smarter and faster.</p>

      <h2 id="task-suggestions" className="scroll-mt-24">
        AI Task Suggestions <TierBadge tier="Premium" />
      </h2>
      <p>Our AI analyzes your project descriptions and automatically suggests relevant tasks and subtasks to break down your work efficiently.</p>
      <ul>
        <li>Create a new project and add a detailed description.</li>
        <li>Click the <strong>Generate Tasks</strong> button.</li>
        <li>Review the suggested tasks and add them to your project with one click.</li>
      </ul>

      <h2 id="document-analysis" className="scroll-mt-24">
        Document Analysis <TierBadge tier="Premium" />
      </h2>
      <p>Upload long documents or specifications, and let our AI summarize the key points and extract action items.</p>
      <Callout type="info" title="Supported Formats">
        <p>Document analysis currently supports PDF, DOCX, and TXT files up to 10MB in size.</p>
      </Callout>
      <ul>
        <li>Upload a document to a task's attachments.</li>
        <li>Select <strong>Analyze with AI</strong> from the file menu.</li>
        <li>Wait a few moments for the summary and extracted action items to appear.</li>
      </ul>
    </DocsLayout>
  );
}
