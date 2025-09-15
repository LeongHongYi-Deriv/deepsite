// Prompt rewriting functionality disabled - was dependent on Hugging Face inference

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const callAiRewritePrompt = async (prompt: string, { token: _token, billTo: _billTo }: { token?: string, billTo?: string | null } = {}) => {
  // Prompt rewriting disabled - requires Hugging Face inference
  // Returning original prompt without modification
  console.log('📝 Prompt rewriting disabled - using original prompt');
  return prompt.trim();
};