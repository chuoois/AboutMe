import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    redirect("/login");
  } else {
    redirect("/settings/projects-manager");
  }

  return null; 
}
