import axios from "axios";

const VT_API_KEY = process.env.VT_API_KEY;

export async function checkUrlReputation(url: string) {
  if (!VT_API_KEY) {
    throw new Error("VirusTotal API Key is missing");
  }

  try {
    // VirusTotal needs the URL to be Base64 encoded (without the '=')
    const urlId = Buffer.from(url).toString("base64").replace(/=/g, "");

    // Call the VT API
    const response = await axios.get(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        headers: {
          "x-apikey": VT_API_KEY,
        },
      },
    );

    // Extract the stats
    const stats = response.data.data.attributes.last_analysis_stats;

    return {
      url,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      totalEngines:
        stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
      isFlagged: stats.malicious > 0 || stats.suspicious > 2,
    };
  } catch (error: unknown) {
    // If VT has never seen this URL before, it returns a 404.
    // In that case, we should tell the user it's "Unknown" (which is also scary!)
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          url,
          error: "URL not yet analyzed by VirusTotal",
          isFlagged: false,
        };
      }
      return { url, error: "API Error", isFlagged: false };
    }
  }
}
