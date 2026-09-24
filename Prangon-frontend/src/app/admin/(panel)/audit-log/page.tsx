import { getAuditLogsAction } from "../actions";
import { AuditTrailClient } from "./AuditTrailClient";

export default async function PlatformAuditLogPage() {
  const res = await getAuditLogsAction();
  const logs = res.data || [];

  return <AuditTrailClient initialLogs={logs} />;
}
