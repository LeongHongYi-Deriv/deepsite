import Anthropic from '@anthropic-ai/sdk';

export class AnthropicClient {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async *chatCompletionStream(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens: number;
  }) {
    // Extract system messages and filter them out from regular messages
    const systemMessages = params.messages.filter(msg => msg.role === 'system');
    const regularMessages = params.messages.filter(msg => msg.role !== 'system');
    
    // Combine all system messages into one system prompt
    const systemPrompt = systemMessages.map(msg => msg.content).join('\n\n');

    // Set appropriate max_tokens based on the actual model
    const getMaxTokensForModel = (modelValue: string) => {
      if (modelValue.includes('haiku')) return 4_096;
      if (modelValue.includes('sonnet')) return 8_192;
      return 8_192; // default to sonnet limit
    };

    const actualMaxTokens = Math.min(params.max_tokens, getMaxTokensForModel(params.model));

    const stream = await this.client.messages.stream({
      model: params.model,
      max_tokens: actualMaxTokens,
      system: systemPrompt || undefined, // Only include if we have system messages
      messages: regularMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield {
          choices: [{
            delta: {
              content: chunk.delta.text
            }
          }]
        };
      }
    }
  }

  async chatCompletion(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens: number;
  }) {
    // Extract system messages and filter them out from regular messages
    const systemMessages = params.messages.filter(msg => msg.role === 'system');
    const regularMessages = params.messages.filter(msg => msg.role !== 'system');
    
    // Combine all system messages into one system prompt
    const systemPrompt = systemMessages.map(msg => msg.content).join('\n\n');

    // Set appropriate max_tokens based on the actual model
    const getMaxTokensForModel = (modelValue: string) => {
      if (modelValue.includes('haiku')) return 4_096;
      if (modelValue.includes('sonnet')) return 8_192;
      return 8_192; // default to sonnet limit
    };

    const actualMaxTokens = Math.min(params.max_tokens, getMaxTokensForModel(params.model));

    const response = await this.client.messages.create({
      model: params.model,
      max_tokens: actualMaxTokens,
      system: systemPrompt || undefined, // Only include if we have system messages
      messages: regularMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    return {
      choices: [{
        message: {
          content: response.content[0].type === 'text' ? response.content[0].text : ''
        }
      }]
    };
  }
} 