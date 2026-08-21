import { NextRequest, NextResponse } from "next/server";

// Redirects the bare root to the visitor's preferred locale.
// All real routes live under /en and /fr; hreflang alternates handle SEO.
export default function proxy(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const locale = /(^|,|;|\s)fr\b/.test(acceptLanguage) ? "fr" : "en";
  const url = new URL(`/${locale}`, request.url);
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  matcher: ["/"],
};
