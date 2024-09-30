import { StripeProvider as ProviderStripe } from '@stripe/stripe-react-native';
import { PropsWithChildren } from 'react';

export default function StripeProvider({ children }: PropsWithChildren) {
  const publishableKey = 'pk_test_51Q2GFU08guvTJ39R3PQw1VnGYYaCobwNki0Uu1yckn5fglh4YLFeS3QrGdJNP7UU5UqlmSxlUyWoNZLAfEdZWthX00AZGlQ1oN';
  return (
    <ProviderStripe
      publishableKey={publishableKey}
     >
      { children }
    </ProviderStripe>
  )
}