import axios from "axios";

const API_URL = "https://api.virustotal.com/vtapi/v2/url/report";

export async function getUrlReport(url: string) {
  const response = await axios.get(API_URL, {
    params: {
      apikey: process.env.VT_API_KEY,
      resource: url,
    },
  });
  return response.data;
}
