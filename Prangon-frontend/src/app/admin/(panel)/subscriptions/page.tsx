import { getAllSubscriptionsAction } from "../actions";
import { SubscriptionMonitorClient } from "./SubscriptionMonitorClient";

export default async function PlatformSubscriptionsPage() {
  const res = await getAllSubscriptionsAction();
  const subscriptions = res.data || [];

  return <SubscriptionMonitorClient initialSubscriptions={subscriptions} />;
}
