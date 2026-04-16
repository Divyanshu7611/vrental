const RAZORPAY_CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export type RazorpayCheckoutCtor = new (opts: object) => { open: () => void };

export function getRazorpayConstructor(): RazorpayCheckoutCtor | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Razorpay?: RazorpayCheckoutCtor }).Razorpay;
}

/** Wait for layout-injected checkout.js, or inject it if missing (ad blockers / slow networks). */
export async function ensureRazorpayCheckoutLoaded(maxWaitMs = 20000): Promise<void> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    if (getRazorpayConstructor()) return;
    await new Promise((r) => setTimeout(r, 80));
  }
  if (getRazorpayConstructor()) return;
  if (!document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`)) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = RAZORPAY_CHECKOUT_SRC;
      s.async = true;
      s.onload = () =>
        getRazorpayConstructor()
          ? resolve()
          : reject(new Error("Razorpay loaded but is not available"));
      s.onerror = () =>
        reject(new Error("Could not load Razorpay (network, firewall, or ad blocker)"));
      document.body.appendChild(s);
    });
    return;
  }
  throw new Error(
    "Razorpay checkout did not become ready. Refresh the page, allow checkout.razorpay.com, and try again."
  );
}
