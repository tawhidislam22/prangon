import { getAllUsersAction } from "../actions";
import { UserDirectoryClient } from "./UserDirectoryClient";

export default async function PlatformUsersPage() {
  const res = await getAllUsersAction();
  const users = res.data || [];

  return <UserDirectoryClient initialUsers={users} />;
}
