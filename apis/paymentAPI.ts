import { apiFetch } from "./databaseAPI";

export default function paymentAPI() {
  return {
    async paymentSheetParams({ amount, localCustomerId } : { amount: number, localCustomerId: string | null }) {
      const response = await apiFetch(`payments/payment-sheet`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          providedCustomerId: localCustomerId,
        }),
      });
      const { paymentIntent, paymentIntentSecret, ephemeralKey, customer } = response;
      return {
        paymentIntent,
        paymentIntentSecret,
        ephemeralKey,
        customer
      }
    }
  };
}