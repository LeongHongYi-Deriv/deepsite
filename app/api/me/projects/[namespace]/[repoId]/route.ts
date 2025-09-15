import { NextRequest, NextResponse } from "next/server";
// REMOVED - All Hugging Face dependencies  
// import { RepoDesignation, spaceInfo, uploadFiles, listFiles } from "@huggingface/hub";
// import { isAuthenticated } from "@/lib/auth";
// import Project from "@/models/Project";
// import dbConnect from "@/lib/mongodb";
// import { Page } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  // Project loading disabled - was dependent on Hugging Face Spaces
  const { namespace, repoId } = await params;
  
  return NextResponse.json(
    {
      message: `Project loading disabled - ${namespace}/${repoId} was stored in Hugging Face Spaces`,
      ok: false,
    },
    { status: 501 }
  );
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  // Project updating disabled - was dependent on Hugging Face Spaces
  const { namespace, repoId } = await params;
  
  return NextResponse.json(
    {
      message: `Project updating disabled - ${namespace}/${repoId} was stored in Hugging Face Spaces`,
      ok: false,
    },
    { status: 501 }
  );
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  // Project operations disabled - was dependent on Hugging Face Spaces
  const { namespace, repoId } = await params;
  
  return NextResponse.json(
    {
      message: `Project operations disabled - ${namespace}/${repoId} was stored in Hugging Face Spaces`,
      ok: false,
    },
    { status: 501 }
  );
}
