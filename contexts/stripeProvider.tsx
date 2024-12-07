import getEnv from '@/util/getEnv';
import { StripeProvider as ProviderStripe } from '@stripe/stripe-react-native';
import React from 'react';
import { PropsWithChildren } from 'react';

const environment = getEnv();
let publishableKey = 'pk_test_51Q2GFU08guvTJ39R3PQw1VnGYYaCobwNki0Uu1yckn5fglh4YLFeS3QrGdJNP7UU5UqlmSxlUyWoNZLAfEdZWthX00AZGlQ1oN';

if (environment != 'development') {
  publishableKey = 'pk_live_51Q2GFU08guvTJ39RyhvHzV2xZwNSS5n9nQaPP45fSz0lxOOB1rWRDHtExvBc6B8mXSAw3ndiyPgf2F5wcSXVJkWn00lhNcvmZS';
}

export default function StripeProvider({ children }: PropsWithChildren) {
  return (
    <ProviderStripe
      publishableKey={publishableKey}
     >
      { children }
    </ProviderStripe>
  )
}