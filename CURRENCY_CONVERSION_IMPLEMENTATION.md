### **Popular Currencies:**
- 🇺🇸 **USD** - US Dollar (rate: 0.000063)
- 🇪🇺 **EUR** - Euro (rate: 0.000052)
- 🇬🇧 **GBP** - British Pound (rate: 0.000046)
- 🇸🇬 **SGD** - Singapore Dollar (rate: 0.000078)
- 🇯🇵 **JPY** - Japanese Yen (rate: 0.0092)
- 🇦🇺 **AUD** - Australian Dollar (rate: 0.000092)
- 🇨🇦 **CAD** - Canadian Dollar (rate: 0.000084)
- 🇨🇭 **CHF** - Swiss Franc (rate: 0.000047)
- 🇨🇳 **CNY** - Chinese Yuan (rate: 0.000424)
- 🇮🇳 **INR** - Indian Rupee (rate: 0.0053)
- 🇰🇷 **KRW** - South Korean Won (rate: 0.087)
- 🇲🇾 **MYR** - Malaysian Ringgit (rate: 0.000248)
- 🇹🇭 **THB** - Thai Baht (rate: 0.00196)
- 🇻🇳 **VND** - Vietnamese Dong (rate: 1.44)
- 🇵🇭 **PHP** - Philippine Peso (rate: 0.0035)
- 🇮🇩 **IDR** - Indonesian Rupiah (BASE: rate: 1.0)

### **User Flow:**
1. User clicks **Globe icon (🌐)** in navbar
2. Opens **GlobalSettingsModal**
3. Selects desired currency from dropdown
4. System fetches real-time exchange rate from API
5. All prices throughout the app update instantly

### **Technical Flow:**
```
User selects currency
     ↓
CurrencyContext.setSelectedCurrency()
     ↓
Fetch from /api/exchange-rates?currency=XXX
     ↓
Update global store with new rate
     ↓
All components using useCurrency() re-render
     ↓
Prices displayed in new currency
```

---

## 📊 **Price Conversion Formula**

```typescript
const convertedPrice = priceInIDR * exchangeRate;

const formattedPrice = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: selectedCurrency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(convertedPrice);
```