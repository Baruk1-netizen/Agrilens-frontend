# AgriLens Frontend

A Next.js application for agricultural image analysis and recommendation system.

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Baruk1-netizen/Agrilens-frontend.git
cd Agrilens-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

#### Create environment file
```bash
cp .env.example .env.local
```

#### Configure environment variables
Open `.env.local` and set the following variables:

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable the Google Identity API
4. Create OAuth 2.0 credentials (Web application)
5. Add your domain to authorized origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` 
   - `http://localhost:3002`
   - Your production domain
6. Copy the Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**API Configuration:**
- Set `NEXT_PUBLIC_API_BASE_URL` to your backend API URL

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 🌱 Agricultural image analysis
- 📱 Camera integration for photo capture
- 🔐 Google OAuth authentication
- 🎯 AI-powered recommendations
- 📊 User dashboard and analytics

## Tech Stack

- **Framework:** Next.js 15.3.4
- **UI:** React 19, Tailwind CSS, Framer Motion
- **Authentication:** Google OAuth 2.0
- **Icons:** Lucide React
- **Development:** Turbopack

## Security

- Environment variables are used for all sensitive configuration
- `.env.local` is excluded from version control
- Follow the `.env.example` template for setup

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
