import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDomain(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();
    
    // Optional: Remove 'www.' for cleaner analysis
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch (error: unknown) {
    // If the URL is malformed, we return null
    return null;
  }
}