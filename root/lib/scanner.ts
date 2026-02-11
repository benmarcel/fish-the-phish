// scan email and get the required data for analysis

export function extractUrls(emailContent: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  // THE MATCH
  const matches = emailContent.match(urlRegex) || [];

  // CLEANING & UNIQUENESS
  const cleanUrls = matches.map((url) => {
    // Remove common trailing punctuation that gets caught in the regex
    // "Check out https://scam.com." -> removes the "." at the end
    return url.replace(/[.,!?;:)]+$/, "");
  });
  //  DEDUPLICATION
  // Set automatically deletes duplicates. We then turn it back into an Array.
  return Array.from(new Set(cleanUrls));
}