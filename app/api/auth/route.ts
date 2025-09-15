import { NextResponse } from "next/server";

export async function POST() {
  // Authentication disabled - was dependent on Hugging Face OAuth
  return NextResponse.json(
    { 
      error: "Authentication disabled - was dependent on Hugging Face OAuth. This app now works without login." 
    },
    {
      status: 501,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
