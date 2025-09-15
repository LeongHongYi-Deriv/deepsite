"use server";

// REMOVED - All Hugging Face dependencies
// import { isAuthenticated } from "@/lib/auth";
// import dbConnect from "@/lib/mongodb";
// import Project from "@/models/Project";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteProject(_spaceId: string) {
  // Project deletion disabled - was dependent on Hugging Face authentication
  return {
    error: "Project deletion disabled - was dependent on Hugging Face authentication",
    ok: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function cloneProject(_sourceSpaceId: string, _title: string) {
  // Project cloning disabled - was dependent on Hugging Face Spaces
  return {
    error: "Project cloning disabled - was dependent on Hugging Face Spaces",
    ok: false,
  };
}
