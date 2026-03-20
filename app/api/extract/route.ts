import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    // Advanced headers to bypass basic bot protection (429 Too Many Requests)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0"
      },
    });

    if (!response.ok) {
      // If it's a 429 or 403, it's likely Cloudflare/Bot protection
      if (response.status === 429 || response.status === 403) {
         throw new Error(`Anti-Bot Protection Blocked Us (HTTP ${response.status}). This site prevents automated scraping.`);
      }
      throw new Error(`Failed to fetch URL: HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, footer, header, aside, iframe, noscript, svg").remove();

    const turndownService = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
    const markdown = turndownService.turndown($.html());

    return NextResponse.json({ url, status: "success", markdown });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}