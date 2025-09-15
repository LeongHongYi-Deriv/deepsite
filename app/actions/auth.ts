"use server";

// REMOVED - Hugging Face authentication dependencies
// import { headers } from "next/headers";

export async function getAuth() {
  // Authentication disabled - was dependent on Hugging Face OAuth
  return "Authentication disabled - this app now works without login";
}
