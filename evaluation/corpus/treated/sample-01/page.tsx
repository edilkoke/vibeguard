// DEMO FIXTURE — secure equivalent. Renders text safely; session lives in an HttpOnly cookie.
export default function Profile({ bio }: { bio: string }) {
  // Renders text safely (auto-escaped); session stays in an HttpOnly cookie.
  return <div className="bio">{bio}</div>;
}
