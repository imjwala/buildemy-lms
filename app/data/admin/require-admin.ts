import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * `requireAdmin` is an asynchronous function that checks if the current user has an active session
 * and if their role is 'admin'.
 * It uses `React.cache` to memoize the result of fetching the session during a single server render cycle.
 *
 * @description
 * Why use `React.cache`?
 * In a Next.js application with Server Components, it’s common for multiple components in the same render tree
 * to need access to the same information, such as the user's session data. Without `cache`, each call to `requireAdmin`
 * (e.g., in different layouts or components) would execute `auth.api.getSession` repeatedly,
 * resulting in multiple database or authentication service queries for the same request.
 *
 * `React.cache` wraps the function and ensures that within a single server render, the function
 * only executes once. Subsequent calls to `requireAdmin` in the same render cycle return
 * the cached result (the user session or redirect), significantly improving performance.
 *
 * @returns {Promise<import("better-auth").Session | never>} - Returns the user's session if they are an admin.
 * Otherwise, redirects the user to '/login' or '/not-admin' and never resolves the promise.
 */

export const requireAdmin = cache(async() => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if(!session){
    return redirect("/login")
  }

  if(session.user.role !== "admin"){
    return redirect("/not-admin")
  }

  return session;
})
