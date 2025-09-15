import { NextRequest, NextResponse } from "next/server";
// REMOVED - All Hugging Face dependencies
// import { RepoDesignation, uploadFiles } from "@huggingface/hub";
// import { isAuthenticated } from "@/lib/auth";
// import Project from "@/models/Project";
// import dbConnect from "@/lib/mongodb";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  // Image upload disabled - was dependent on Hugging Face Spaces
  const { namespace, repoId } = await params;
  
  return NextResponse.json(
    {
      message: `Image upload disabled - ${namespace}/${repoId} was stored in Hugging Face Spaces. Use image URLs directly in prompts instead.`,
      ok: false,
    },
    { status: 501 }
  );
}
