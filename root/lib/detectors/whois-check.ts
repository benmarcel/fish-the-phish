// import whois from 'whois-json';

export async function checkDomainAge(domain: string) {
  try {
    // 1. Call the API Ninjas Whois endpoint
    const response = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`API Ninjas error: ${response.statusText}`);
    }

    const data = await response.json();

    // 2. Handle cases where the domain isn't found or has no date
    if (!data.creation_date) {
      return {
        domain,
        ageInDays: null,
        creationDate: null,
        isNew: false
      };
    }

    // 3. Calculate the age (API Ninjas returns seconds, so we multiply by 1000 for JS)
    const creationDate = new Date(data.creation_date * 1000);
    const now = new Date();
    const diffInMs = now.getTime() - creationDate.getTime();
    const ageInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return {
      domain,
      ageInDays,
      creationDate: creationDate.toISOString(),
      // Flag as "New" if the domain is less than 30 days old (Phishing Trap!)
      isNew: ageInDays <= 30 
    };

  } catch (error) {
    console.error(`WHOIS error for ${domain}:`, error);
    return { domain, ageInDays: null, creationDate: null, isNew: false };
  }
}