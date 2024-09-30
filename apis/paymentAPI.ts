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
      if (Object.hasOwn(response, 'errorMessage')) {
        return {
          paymentIntent: null,
          ephemeralKey: null,
          customer: null,
        }
      }
      const { paymentIntent, ephemeralKey, customer } = response;
      return {
        paymentIntent,
        ephemeralKey,
        customer
      }
    }
  };
}