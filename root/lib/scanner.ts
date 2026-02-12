// scan email and get the required data for analysis

export function extractUrls(text: string): string[] {
  //  Standard URLs (http://...)
  const standardUrlRegex = /(https?:\/\/[^\s"'>]+)/gi;
  
  // Hidden HTML links (href="...")
  const htmlHrefRegex = /href=["'](https?:\/\/[^"']+)["']/gi;

  const standardMatches = text.match(standardUrlRegex) || [];
  
  // For the HTML regex, we need to "map" it to get just the link inside the quotes
  const htmlMatches = Array.from(text.matchAll(htmlHrefRegex), m => m[1]);

  // Combine both lists
  const allMatches = [...standardMatches, ...htmlMatches];

  // Clean and Deduplicate (same as before)
  const cleanUrls = allMatches.map(url => url.replace(/[.,!?;:)]+$/, ""));
  return Array.from(new Set(cleanUrls));
}