# Chrome UX Report Web Application

A web application that fetches and displays Chrome UX Report (CrUX) data for specified URLs, providing insights into web performance metrics across different devices.

## Features

- Fetch CrUX data for multiple URLs
- Support for different device types (Phone, Desktop, Tablet)
- Filter metrics by type
- Sort data by various performance indicators
- Set P75 threshold filters
- Responsive design
- Real-time data updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome UX Report (CrUX) API key

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# API Configuration
CRUX_API_KEY=your_crux_api_key_here
CRUX_API_URL=https://chromeuxreport.googleapis.com/v1/records:queryRecord

# Server Configuration
PORT=3001

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chromeUxReportWebApp
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:5173
```

## Usage

1. Enter one or more URLs to analyze (up to 10 URLs)
2. Select the device type (Phone, Desktop, or Tablet)
3. Click "Fetch Data" to retrieve CrUX data
4. Use the filters and sorting options to analyze the data:
   - Filter by metric type
   - Sort by any column
   - Set P75 threshold to filter results

## Available Metrics

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Experimental Time To First Byte (TTFB)
- Interaction To Next Paint (INP)

## Error Handling

The application handles various error scenarios:

- Invalid URLs
- Network errors
- API rate limits
- Missing data
- Server errors

Error messages are displayed clearly in the UI when they occur.

## Project Structure

```
chromeUxReportWebApp/
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```
