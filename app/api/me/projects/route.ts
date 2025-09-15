import { NextResponse } from "next/server";
// REMOVED - All Hugging Face dependencies
// import { createRepo, RepoDesignation, uploadFiles } from "@huggingface/hub";
// import { isAuthenticated } from "@/lib/auth";
// import dbConnect from "@/lib/mongodb";
// import Project from "@/models/Project";
// import { Page } from "@/types";

export async function GET() {
  // Project management disabled - was dependent on Hugging Face Spaces
  return NextResponse.json(
    {
      message: "Project management disabled in standalone mode",
      projects: [],
      ok: false,
    },
    { status: 501 }
  );
}

export async function POST() {
  // Project creation disabled - was dependent on Hugging Face Spaces  
  return NextResponse.json(
    {
      message: "Project creation disabled - was dependent on Hugging Face Spaces. Use the editor directly for AI generation.",
      ok: false,
    },
    { status: 501 }
  );
}
