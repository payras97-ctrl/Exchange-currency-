export const getFlagEmoji = (currencyCode: string): string => {
  // Mapping specific currencies that don't match country codes perfectly
  const customMap: Record<string, string> = {
    EUR: '🇪🇺',
    USD: '🇺🇸',
    GBP: '🇬🇧',
    AUD: '🇦🇺',
    CAD: '🇨🇦',
    CHF: '🇨🇭',
    JPY: '🇯🇵',
    NZD: '🇳🇿',
    ZAR: '🇿🇦',
    CNY: '🇨🇳',
    INR: '🇮🇳',
    SGD: '🇸🇬',
    HKD: '🇭🇰',
    AED: '🇦🇪',
    THB: '🇹🇭',
    KRW: '🇰🇷',
    MXN: '🇲🇽',
    BRL: '🇧🇷',
    TRY: '🇹🇷',
    SEK: '🇸🇪',
    NOK: '🇳🇴',
    DKK: '🇩🇰',
    PLN: '🇵🇱',
    BTC: '₿'
  };

  if (customMap[currencyCode]) return customMap[currencyCode];

  // For others, attempt to derive from the first two letters of the currency code
  const countryCode = currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
    
  return String.fromCodePoint(...codePoints);
};

export const formatCurrency = (value: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
};
