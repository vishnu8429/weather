# Weather App

A responsive weather application built using nextjs and openweathermap. It fetches real-time weather data based on user location or city search and displays weather info with a clean UI.

## Features

- Openweather api

## Technologies Used

- Frontend: React.js 19, Next.js 16, Redux Toolkit, React Redux, React Icons, Tailwind CSS
- Deployment: Vercel

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Install the dependencies: `npm install`
3. Set up the environment variables.
4. Start the development server: `npm run dev`
5. Open your browser and visit: `http://localhost:3000`

## Project Structure

This project uses Next.js 16 with the App Router architecture and follows a `src/` directory structure:

```
├── src/
│   ├── app/               # App Router directory
│   │   ├── weather        # Weather info
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   ├── pages/             # Pages Router
│   ├── components/        # Reusable UI components
│   ├── utils/             # Utility functions
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## Contributing

Contributions are welcome! Please follow the contributing guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
