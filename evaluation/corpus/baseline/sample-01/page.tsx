// DEMO FIXTURE — intentionally vulnerable. Do not copy.
export default function Profile({ bio, token }: { bio: string; token: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token); // VG-015 token in localStorage
  }
  return <div dangerouslySetInnerHTML={{ __html: bio }} />; // VG-012 XSS sink
}
