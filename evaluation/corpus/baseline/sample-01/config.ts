// DEMO FIXTURE — intentionally vulnerable. Do not copy.
// VG-008: a secret key behind a NEXT_PUBLIC_ prefix ships to the client.
export const stripeKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
