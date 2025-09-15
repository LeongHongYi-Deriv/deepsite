import { NextResponse } from "next/server";

export async function GET() {
  // User info endpoint disabled - was dependent on Hugging Face authentication
  return NextResponse.json(
    { 
      user: null, 
      errCode: 501,
      message: "User authentication disabled - was dependent on Hugging Face OAuth"
    }, 
    { status: 501 }
  );
}
