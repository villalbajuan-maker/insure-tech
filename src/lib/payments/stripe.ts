import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;

export function getStripeClient(): Stripe | null {
  if (!stripeApiKey) {
    return null;
  }

  return new Stripe(stripeApiKey, {
    apiVersion: "2025-08-27.basil"
  });
}

export async function createPrototypeCheckoutSession(params: {
  analysisId: string;
  customerEmail: string;
}) {
  const stripe = getStripeClient();
  const successUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  if (!stripe) {
    return {
      provider: "stripe" as const,
      status: "pending" as const,
      amount: 49,
      currency: "USD" as const,
      checkoutUrl: `/analyses/${params.analysisId}?checkout=demo`,
      sessionId: `demo-session-${params.analysisId}`
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: "Florida Homeowners Insurance Gap Analysis"
          },
          unit_amount: 4900
        }
      }
    ],
    success_url: `${successUrl}/analyses/${params.analysisId}?payment=success`,
    cancel_url: `${successUrl}/?payment=cancelled`,
    metadata: {
      analysisId: params.analysisId
    }
  });

  return {
    provider: "stripe" as const,
    status: "pending" as const,
    amount: 49,
    currency: "USD" as const,
    checkoutUrl: session.url ?? `/analyses/${params.analysisId}`,
    sessionId: session.id
  };
}
