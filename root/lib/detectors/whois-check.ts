import whois from 'whois-json';

export interface DomainAgeResult {
  domain: string;
  ageInDays: number | null;
  creationDate: string | null;
  isNew: boolean; // True if less than 30 days old
}

export async function checkDomainAge(domain: string): Promise<DomainAgeResult> {
  try {
    const result = await whois(domain);

    // WHOIS data is messy. Different registrars use different keys.
    // We check the most common ones.
    let creationDateStr;
    if (Array.isArray(result)) {
      creationDateStr = result[0]?.data?.creationDate || null;
    } else {
      creationDateStr = result.creationDate || null;
    }

    if (!creationDateStr) {
      return { domain, ageInDays: null, creationDate: null, isNew: false };
    }

    const created = new Date(creationDateStr);
    const now = new Date();
    
    // Calculate the difference in milliseconds and convert to days
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const ageInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      domain,
      ageInDays,
      creationDate: created.toISOString(),
      isNew: ageInDays <= 30 // A domain younger than 30 days is "High Risk"
    };
  } catch (error) {
    console.error(`WHOIS error for ${domain}:`, error);
    return { domain, ageInDays: null, creationDate: null, isNew: false };
  }
}