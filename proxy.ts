import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use supabase.auth.getSession() in server code.
  // Use getClaims() to validate the JWT signature every time.
  await supabase.auth.getClaims();

  // Optional: redirect unauthenticated users to /login
  // Uncomment the block below if you want to protect all matched routes.
  //
  // if (!claims) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  // Apply cache-prevention headers to avoid CDN session leaks
  supabaseResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  supabaseResponse.headers.set("Pragma", "no-cache");
  supabaseResponse.headers.set("Expires", "0");
  supabaseResponse.headers.set("Surrogate-Control", "no-store");

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
