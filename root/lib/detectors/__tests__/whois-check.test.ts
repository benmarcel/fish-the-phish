import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkDomainAge } from '../whois-check';

// We mock 'fetch' so we don't call API Ninjas for real
global.fetch = vi.fn();

describe('checkDomainAge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should flag a brand new domain as isNew: true', async () => {
    const mockDate = Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60); // 2 days ago
    
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ creation_date: mockDate }),
    });

    const result = await checkDomainAge('scam-site.com');

    expect(result.isNew).toBe(true);
    expect(result.ageInDays).toBe(2);
  });

  it('should flag an old domain as isNew: false', async () => {
    const tenYearsAgo = Math.floor(Date.now() / 1000) - (3650 * 24 * 60 * 60);
    
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ creation_date: tenYearsAgo }),
    });

    const result = await checkDomainAge('google.com');

    expect(result.isNew).toBe(false);
    expect(result.ageInDays).toBeGreaterThan(3000);
  });
});