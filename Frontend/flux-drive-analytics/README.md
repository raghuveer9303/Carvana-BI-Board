# Carvana Analytics Dashboard

A modern React-based analytics dashboard for Carvana vehicle inventory and sales management.

## Features

- 📊 Real-time vehicle inventory tracking
- 📈 Sales analytics and performance metrics  
- 🎯 Interactive data visualizations
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- ⚡ Fast performance with Vite bundler

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts for data visualization
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carvana-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```
VITE_API_BASE_URL=/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── charts/         # Chart components
│   └── layout/         # Layout components
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── lib/                # Configuration and setup files
```

## API Integration

The dashboard connects to a FastAPI backend that provides:

- Vehicle inventory data
- Sales metrics and trends
- Real-time analytics
- Historical data for reporting

## Deployment

### Docker Deployment

The application includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -f Dockerfile.prod -t carvana-dashboard .

# Run the container
docker run -p 80:80 carvana-dashboard
```

### Environment Variables

- `VITE_API_BASE_URL` - API endpoint URL (default: `/api`)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary to Carvana.
