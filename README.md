# Weather App

A responsive weather application built with Next.js and OpenWeatherMap API. It fetches real-time weather data based on user location or city search and displays comprehensive weather information with a clean, modern UI.

## 🌐 Live Demo

**Deployed Application:** [https://weather-pi-inky.vercel.app/](https://weather-pi-inky.vercel.app/)

## 📋 Features

- **Location-based Weather**: Automatically fetches weather data based on user's geolocation
- **City Search**: Search for weather in any city worldwide with autocomplete suggestions
- **5-Day Forecast**: View weather forecasts for the next 5 days
- **3-Hour Interval Details**: Click on any day to see detailed 3-hour interval forecasts
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Fully responsive UI that works on all devices
- **Real-time Data**: Fetches up-to-date weather information from OpenWeatherMap API
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading indicators during data fetching

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Icons** - Icon library

### APIs & Services
- **OpenWeatherMap API** - Weather data provider
  - Forecast API (5-day/3-hour forecast)
  - Geocoding API (city search)

### Deployment
- **Vercel** - Hosting and deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishnu8429/weather.git
   cd weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **⚠️ Important**: The application requires environment variables to function. Without them, the app will not be able to fetch weather data.
   
   Create a `.env.local` file in the root directory (same level as `package.json`):
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_OPENWEATHER_BASE_URL=https://api.openweathermap.org
   ```
   
   **Environment Variables Explained**:
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
     - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
     - Sign up for a free account and navigate to API keys section
   - `NEXT_PUBLIC_OPENWEATHER_BASE_URL`: The base URL for OpenWeatherMap API (required)
     - Default value: `https://api.openweathermap.org`
   
   **File Location**: 
   - Create `.env.local` in the project root directory
   - The `.env.local` file is already in `.gitignore`, so it won't be committed to the repository
   - For production deployment (e.g., Vercel), add these variables in your deployment platform's environment settings
   
   **Example `.env.local` file**:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=abc123def456ghi789jkl012mno345pq
   NEXT_PUBLIC_OPENWEATHER_BASE_URL=https://api.openweathermap.org
   ```
   
   **Troubleshooting**:
   - If you see errors about missing API key, ensure `.env.local` exists in the root directory
   - Restart the development server after creating or modifying `.env.local`
   - Make sure there are no spaces around the `=` sign in the `.env.local` file
   - Variable names must start with `NEXT_PUBLIC_` to be accessible in the browser

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── not-found.tsx       # 404 page
│   │   ├── robots.ts           # Robots.txt
│   │   └── sitemap.ts          # Sitemap
│   ├── components/             # React components
│   │   ├── core/               # Core components
│   │   │   ├── Header.tsx      # App header
│   │   │   ├── SearchBar.tsx   # City search with autocomplete
│   │   │   ├── UnitToggle.tsx  # Temperature unit switcher
│   │   │   └── WeatherIcon.tsx # Weather icon component
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loader.tsx
│   │   ├── DayDetails.tsx      # Day detail view
│   │   ├── FiveDayForecast.tsx # 5-day forecast view
│   │   ├── ForecastCard.tsx    # Forecast card component
│   │   ├── ForecastIntervalCard.tsx # 3-hour interval card
│   │   ├── LocationPermission.tsx # Location permission handler
│   │   └── WeatherDisplay.tsx  # Main weather display
│   ├── hooks/                  # Custom React hooks
│   │   ├── useClickOutside.ts
│   │   ├── useDebounce.ts
│   │   └── useKeyboardNavigation.ts
│   ├── store/                  # Redux store
│   │   ├── api/                # RTK Query API
│   │   │   ├── base.ts         # Base API configuration
│   │   │   └── weather.ts      # Weather API endpoints
│   │   ├── slices/             # Redux slices
│   │   │   └── weather.ts      # Weather state slice
│   │   ├── types/              # TypeScript types
│   │   │   └── weather.ts      # Weather-related types
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── store.ts            # Store configuration
│   │   └── StoreProvider.tsx   # Store provider component
│   └── utils/                  # Utility functions
│       └── helper.ts
├── public/                      # Static assets
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🤔 Assumptions & Trade-offs

### Assumptions
1. **API Rate Limits**: Assumes OpenWeatherMap API free tier (60 calls/minute) is sufficient for development and moderate usage
2. **Browser Support**: Assumes modern browsers with geolocation API support
3. **Network Availability**: Assumes users have internet connectivity for API calls
4. **Location Permissions**: Users may deny location access, so city search is provided as an alternative

### Trade-offs
1. **State Management**: Used Redux Toolkit + RTK Query for centralized state management and API caching, which adds some complexity but provides better data synchronization and caching benefits
2. **API Calls**: All API calls are made client-side to keep the app simple, but this exposes the API key in the browser (mitigated by using `NEXT_PUBLIC_` prefix and rate limiting)
3. **Error Handling**: Generic error messages are shown to users to avoid exposing technical details, but this may make debugging harder
4. **Forecast Data**: Uses 5-day/3-hour forecast API which provides data in 3-hour intervals, not minute-by-minute precision
5. **Styling**: Uses Tailwind CSS utility classes for rapid development, which can make some components verbose but ensures consistency
6. **Type Safety**: Full TypeScript implementation adds development overhead but provides better code quality and maintainability

## 🤖 AI Assistant Usage

This project utilized AI assistance for specific development tasks. The following areas were improved with targeted AI prompts:

### Components Refactoring
**AI Prompt Used**: "Refactor Components to improve reusability and maintainability"
- Component architecture was optimized to follow React best practices
- Component complexity was reduced for improved readability

### Performance Optimization
**AI Prompt Used**: "Optimize the application for better performance"
- Performance bottlenecks were identified and addressed
- Rendering optimizations were applied to reduce unnecessary re-renders

### OpenWeather API Error Handling
**AI Prompt Used**: "Implement comprehensive error handling for OpenWeather API"
- Error handling strategy was designed to gracefully handle various API error scenarios
- The implementation in `src/store/api/base.ts` and `src/store/api/weather.ts` handles:
  - OpenWeather API error responses (cod field handling)
  - Edge cases like empty responses, malformed data

### Redux Toolkit & State Management
**AI Prompt Used**: "Help with RTK slice and state management setup"
- RTK Query configuration was optimized
- The Redux slice structure in `src/store/slices/weather.ts` was designed to:
  - Handle loading states, errors, and data transformations efficiently
  - Maintain type safety throughout the state management layer

### Code Review & Quality
**AI Prompt Used**: "Review code for bugs, security issues, and quality improvements"
- Code review was performed to identify potential bugs and security issues
- Coding patterns and best practices were ensured across the codebase
- Code style and formatting suggestions were applied

### Key Decisions Made with AI Assistance
1. **Error Handling Approach**: Decided to transform OpenWeather API errors (with `cod` field) into successful responses at the base query level, allowing `transformResponse` to handle them gracefully and return empty forecast views
2. **State Synchronization**: Chose to use RTK Query's `extraReducers` to automatically sync query states to Redux, reducing boilerplate and ensuring consistency
3. **Type Safety**: Implemented comprehensive TypeScript types for all API responses and state structures to catch errors at compile time
4. **Component Structure**: Organized components into `core/` and `ui/` directories for better maintainability and clear separation of concerns

### For Future Developers
When maintaining or extending this codebase:
- The error handling logic in `base.ts` is designed to be extensible - new error scenarios can be added to the `extractErrorMessage` function
- The RTK Query setup allows easy addition of new API endpoints following the existing pattern in `weather.ts`
- Component refactoring followed React best practices, so new components should follow similar patterns
- All AI-assisted code has been reviewed and tested, but if you encounter issues, check the error handling and state management patterns first

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or suggestions, please open an issue on [GitHub](https://github.com/vishnu8429/weather/issues).
