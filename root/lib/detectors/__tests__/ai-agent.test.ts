// src/lib/detectors/__tests__/ai-agent.test.ts
import { describe, it, expect, vi } from 'vitest';
import { analyzeWithAI } from '../ai-agent';

vi.mock('openai', () => {
  // Proper ES6 class
  class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            { 
              message: { 
                content: JSON.stringify({
                  threatLevel: 'high',
                  summary: 'Fake Phish',
                  analysis: 'Sus',
                  verdict: 'Delete'
                }) 
              } 
            }
          ]
        })
      }
    };
  }

  return {
    default: MockOpenAI
  };
});

describe('analyzeWithAI', () => {
  it('should parse the AI JSON response correctly', async () => {
    const result = await analyzeWithAI('Help me!', []);
    
    expect(result.threatLevel).toBe('high');
    expect(result.verdict).toBe('Delete');
  });
});