const USDollar = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function toCurrency(value: number) {
  return USDollar.format(value);
};