import { MyProjects } from "@/components/my-projects";

// REMOVED - HF dependencies
// import { redirect } from "next/navigation";
// import { getProjects } from "@/app/actions/projects";

export default async function ProjectsPage() {
  // Projects functionality disabled - was dependent on Hugging Face authentication
  return <MyProjects />;
}
