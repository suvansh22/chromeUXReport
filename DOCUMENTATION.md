# Chrome UX Report Documentation

## Design

### Overview

The Chrome UX Report project is a web application designed to fetch and display user experience metrics for specified URLs. It leverages the Chrome User Experience Report (CrUX) API to gather data on various performance metrics, providing insights into real-world user experiences. The application is structured into a frontend and a backend, each with distinct responsibilities.

### Frontend

- **Framework**: React with TypeScript
- **State Management**: React's built-in useState, useEffect, and useCallback hooks
- **Lazy Loading**: Implemented for performance optimization
- **UI Components**: Material-UI (MUI) for consistent and responsive design
- **Routing**: React Router for client-side navigation
- **Deployment**: Hosted on Vercel
- **Live Demo**: [Chrome UX Report Web App](https://chrome-ux-report.vercel.app/) 🚀

#### Project Structure:

- `components/` - Reusable UI components
- `pages/` - Page-level components
- `utils/` - Utility functions and type definitions
- `services/` - API service functions
- `constants/` - Application configuration and messages

#### Key Components:

- **UrlInput**: Allows users to input one or more URLs for analysis
- **MetricsSelector**: Enables users to select a specific form factor (e.g., desktop, mobile) for the analysis
- **CruxResults**: Displays the fetched performance data in a tabular format and enabled different filtering and sorting options
- **Fallback**: Loading state component for lazy-loaded components

#### Type Definitions:

- **DeviceType**: Type-safe device form factor selection
- **MetricsData**: Structured type for API response data
- **URLData**: Type definition for individual URL metrics
- **ApiError**: Standardized error type for API responses

#### Workflow:

1. Users input URLs and select a form factor
2. Upon submission, the frontend sends a request to the backend API with retry logic
3. The backend fetches data from the CrUX API and return it.
4. Frontend receives data and process it.
5. If multiple url, then convert it into single dataset.
6. Then displays the data with loading states and error handling

### Backend

- **Framework**: Node.js with Express
- **API Integration**: Interacts with the Chrome UX Report API
- **Deployment**: Hosted on Railway
- **Security**: Basic security headers and rate limiting
- **API URL**: [chromeuxreport-production.up.railway.app](https://chromeuxreport-production.up.railway.app)

#### Endpoints:

- **POST /api/crux**:
  - Accepts JSON payload with URLs and form factor
  - Implements rate limiting and request validation
  - Returns processed data with error handling
- **GET /api/health**: Health check endpoint

#### Features:

- Input validation for URLs and form factors
- Rate limiting to prevent abuse
- Request batching for multiple URLs
- Retry mechanism for failed requests
- Comprehensive error handling
- Logging system for monitoring

## Features

### Core Functionality

- Fetch real-world performance data from the Chrome UX Report API
- Support multiple URLs for simultaneous analysis
- Aggregate data across multiple URLs
- Provide detailed histograms and percentiles
- Enable filtering and sorting of results

### Data Analysis Features

#### Filtering Capabilities

1. **Metric-based Filtering**:

   - Filter results by specific performance metrics:
     - Cumulative Layout Shift (CLS)
     - First Contentful Paint (FCP)
     - Largest Contentful Paint (LCP)
     - Time to First Byte (TTFB)
     - Interaction to Next Paint (INP)
     - Round Trip Time (RTT)

2. **P75 Threshold Filtering**:
   - Filter results based on p75 value thresholds
   - Set custom threshold values.
   - Show only results equal to or above threshold
   - Real-time filtering as threshold changes

#### Sorting Capabilities

1. **P75 Value Sorting**:

   - Sort results by p75 values for each metric
   - Ascending/descending order
   - Quick comparison of performance across URLs

2. **Histogram Value Sorting**:
   - Sort by all three histogram values good, need improvement and poor.
   - Sort in ascending/descending order
   - Compare distribution patterns

### Technical Features

- Type-safe development with TypeScript
- Lazy loading for performance optimization
- Retry mechanism for failed requests
- Request batching for multiple URLs
- Rate limiting and security headers
- Comprehensive error handling
- Loading states and user feedback

### User Experience

- User-friendly UI with Material-UI components
- Responsive design for all devices
- Clear error messages and loading states
- Efficient data processing and display
- Configurable request limits

## Performance Metrics

The application displays various performance metrics from the Chrome UX Report (CrUX):

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)
- Interaction to Next Paint (INP)

Each metric is displayed with:

- Good/Needs Improvement/Poor distribution
- 75th percentile values
- Historical trends
- Device-specific data

## Performance Insights

The application provides intelligent performance insights based on CrUX metrics to help identify and address performance issues:

### Key Features

- Real-time analysis of performance metrics
- Device-specific insights (mobile/desktop)
- Visual indicators for metric status
- Actionable recommendations

### Metric Analysis

The insights panel analyzes:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)
- Interaction to Next Paint (INP)

### Recommendations

Based on the metrics, the system provides specific recommendations for:

- Server optimization
- Image optimization
- Layout stability
- JavaScript execution
- Resource loading

### Visual Indicators

- Green: Good performance
- Yellow: Needs improvement
- Red: Poor performance

### Thresholds

The system uses industry-standard thresholds:

- FCP: < 1.8s (Good), 1.8s-3s (Needs Improvement), > 3s (Poor)
- LCP: < 2.5s (Good), 2.5s-4s (Needs Improvement), > 4s (Poor)
- CLS: < 0.1 (Good), 0.1-0.25 (Needs Improvement), > 0.25 (Poor)
- TTFB: < 0.6s (Good), 0.6s-1s (Needs Improvement), > 1s (Poor)
- INP: < 200ms (Good), 200ms-500ms (Needs Improvement), > 500ms (Poor)

## Configuration

### Frontend Configuration

- Maximum URLs per request: 50
- API timeout: 30 seconds
- Retry attempts: 3
- Batch size: 5 URLs

### Backend Configuration

- Rate limiting: 100 requests per 15 minutes
- Request size limit: 1MB
- CORS configuration for allowed origins
- Environment-based error messages

## Error Handling

### Frontend

- Network error handling with retries
- Input validation error
- Loading state management
- User-friendly error messages
- Type-safe error handling

### Backend

- Request validation
- Rate limiting
- API error handling
- Logging system
- Security headers

## Next Steps

### Planned Improvements

1. **Data Visualization**:

   - Integrate charts for metric visualization
   - Add interactive data exploration
   - Implement metric comparison views

2. **Testing**:
   - Add unit tests for components
   - Implement API integration tests
   - Add end-to-end testing

### Future Enhancements

- Real-time data updates
- Custom metric thresholds
- Export functionality
- User preferences
