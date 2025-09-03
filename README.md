# FinBoard - Financial Dashboard Platform

A modern, customizable financial dashboard that allows users to create and manage financial widgets powered by multiple data providers including Finnhub and Alpha Vantage.

## 🏗️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Charts**: Recharts for financial data visualization
- **Routing**: React Router DOM
- **Language**: TypeScript
- **Icons**: Lucide React

## ✨ Features

- **Multi-Provider Support**: Finnhub and Alpha Vantage APIs
- **Widget-Based Architecture**: Modular, customizable financial widgets
- **Real-Time Data**: Live stock quotes and historical data
- **Responsive Design**: Mobile-first, responsive interface
- **Persistent State**: Dashboard configuration saved locally
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, professional interface with shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys from supported providers

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd finboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔑 API Setup

### Finnhub API

1. Visit [Finnhub.io](https://finnhub.io/register) to create a free account
2. Navigate to `/dashboard` in the application
3. Enter your API key in the setup form

**Free Tier Limits:**
- 60 calls/minute
- 1000 calls/day

### Alpha Vantage API

1. Get your free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Navigate to `/dashboard2` in the application  
3. Add widgets with your API key

**Free Tier Limits:**
- 5 calls/minute
- 500 calls/day

## 📊 Available Dashboards

### Finnhub Dashboard (`/dashboard`)

Real-time stock quotes with:
- Current price display
- Price change indicators
- Refresh functionality
- Symbol-based widgets

### Alpha Vantage Dashboard (`/dashboard2`)

Historical financial data with:
- Time series charts (Daily, Weekly, Monthly, Intraday)
- OHLCV candlestick visualization
- Volume indicators
- Multiple chart intervals

## 🛠️ API Endpoints

### Finnhub Integration

```typescript
// Real-time quote endpoint
GET https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={API_KEY}

// Response format
{
  "c": 261.74,    // Current price
  "h": 263.31,    // High price of the day
  "l": 260.68,    // Low price of the day
  "o": 261.07,    // Open price of the day
  "pc": 259.45,   // Previous close price
  "t": 1582641000 // UNIX timestamp
}
```

### Alpha Vantage Integration

```typescript
// Daily time series
GET https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={SYMBOL}&apikey={API_KEY}

// Intraday data
GET https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={SYMBOL}&interval=5min&apikey={API_KEY}

// Response format (simplified)
{
  "Meta Data": {
    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
    "2. Symbol": "IBM",
    "3. Last Refreshed": "2023-12-01",
    "4. Output Size": "Compact",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2023-12-01": {
      "1. open": "157.50",
      "2. high": "158.85",
      "3. low": "155.31",
      "4. close": "156.23",
      "5. volume": "4567890"
    }
    // ... more data points
  }
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/           # Header, Footer, Hero components
│   ├── modals/          # Widget creation modals
│   ├── ui/              # shadcn/ui components
│   └── widgets/         # Financial widget components
├── lib/                 # Utility functions and API clients
├── pages/              # Route components
├── store/              # Zustand state management
└── hooks/              # Custom React hooks
```

## 🎯 Usage Examples

### Adding a Finnhub Widget

```typescript
// 1. Set up API key in dashboard
const { setApiKey } = useDashboardStore();
setApiKey('your-finnhub-api-key');

// 2. Add widget programmatically
const { addWidget } = useDashboardStore();
addWidget('AAPL'); // Apple Inc.
```

### Adding an Alpha Vantage Widget

```typescript
// 1. Add widget with configuration
const { addWidget } = useAlphaVantageStore();
addWidget('MSFT', 'daily'); // Microsoft daily data

// 2. Available intervals
type Interval = 'daily' | 'weekly' | 'monthly' | '5min' | '15min' | '30min' | '60min';
```

## ⚠️ Important Notes

### API Key Security

**Current Implementation**: API keys are stored in browser localStorage for development convenience.

**Security Considerations:**
- Keys are visible in browser DevTools
- Not recommended for production environments
- Consider server-side proxy for production deployments

### Rate Limiting

Both APIs have strict rate limits:

- **Finnhub**: 60 calls/minute, 1000/day (free)
- **Alpha Vantage**: 25/day (free)

**Handling Rate Limits:**
```typescript
// Error responses indicate rate limiting
{
  "Note": "Thank you for using Alpha Vantage! Our standard API call frequency is 25 calls per day."
}
```

### Data Freshness

- **Finnhub**: Real-time data (15-minute delay for free tier)
- **Alpha Vantage**: End-of-day data for daily/weekly/monthly, real-time for intraday

## 🔧 Configuration

### Environment Setup

No environment variables required for basic setup. API keys are provided by users through the UI.

### Tailwind Configuration

Custom design tokens defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind theme extensions

## 🐛 Troubleshooting

### Common Issues

**API Key Invalid:**
- Verify key format and provider
- Check API key permissions
- Ensure key is active

**Rate Limit Exceeded:**
- Wait for rate limit reset
- Reduce request frequency
- Consider upgrading API plan

**Widget Not Loading:**
- Check network connectivity
- Verify symbol format (e.g., 'AAPL' not 'Apple')
- Check browser console for errors

### Debug Mode

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('debug', 'finboard:*');
```

## 🚧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Adding New Providers

1. Create provider-specific store in `src/store/`
2. Implement API client in `src/lib/`
3. Create widget components in `src/components/widgets/`
4. Add route in `src/App.tsx`

## 🔮 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Advanced charting (candlestick, technical indicators)
- [ ] Portfolio tracking
- [ ] Export/import dashboard configurations
- [ ] Dark mode toggle
- [ ] Drag-and-drop widget arrangement
- [ ] More data providers (Polygon.io, IEX Cloud)
- [ ] Server-side API proxy for enhanced security



===
