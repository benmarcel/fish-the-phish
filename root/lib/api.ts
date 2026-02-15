import axios from "axios";

// generalized API function to call our backend Next.js API route
export async function analyzeEmail(content: string) {
  try {
    const response = await axios.post("/api/analyze", { content });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
