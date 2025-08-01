# Insurity Credit Score Dashboard

A React-based dashboard for visualizing credit scores and telematics data from the Insurity backend API.

## Features

- **Credit Score Visualization**: View credit scores with color-coded risk levels and progress bars
- **Telematics Data Display**: Comprehensive view of driving behavior, vehicle information, and claims history
- **Real-time API Status**: Monitor backend API connection status
- **User Search**: Search for users by ID with sample data functionality
- **Risk Assessment**: Calculated risk scores based on driving behavior and demographics
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Environment Configuration

The dashboard uses environment variables to configure the backend API endpoint. 

### Environment Variables

Create a `.env` file in the frontend directory with:

```
VITE_BACKEND=http://127.0.0.2:8080
```

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the frontend code.

### API Configuration

The API configuration is centralized in `src/utils/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND || 'http://127.0.0.2:8080',
  ENDPOINTS: {
    HEALTH_CHECK: '/',
    USER_CREDIT_INFO: '/user_credit_info',
    USER_TELEMATICS_INFO: '/user_telematics_info'
  }
}
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Ensure `.env` file exists with `VITE_BACKEND` variable
   - Make sure the backend API server is running on the configured port

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Dashboard**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - Use the search functionality to find users (starting from ID 10001)

## API Endpoints

The dashboard connects to the following backend endpoints:

- `GET /` - Health check endpoint
- `GET /user_credit_info/{user_id}` - Get credit score and premium data
- `GET /user_telematics_info/{user_id}` - Get detailed telematics data

## Components

### Dashboard Components

- **Dashboard**: Main container component managing state and API calls
- **UserSearch**: Search interface for finding users by ID
- **CreditScoreCard**: Displays credit score with visual indicators
- **TelematicsCard**: Shows comprehensive telematics data and risk assessment
- **StatsOverview**: Quick statistics overview cards

### API Utilities

- **api.js**: Centralized API configuration and client utilities
  - `API_CONFIG`: Configuration object with base URL and endpoints
  - `apiClient`: Utility functions for making API requests
  - `buildApiUrl`: Helper for constructing API URLs

## Data Structure

### Credit Score Data
```json
{
  "user_id": 10001,
  "credit_score": 750.5,
  "premium": 1250.00
}
```

### Telematics Data
Contains comprehensive driving and demographic data including:
- Personal information (age, gender, marital status)
- Vehicle information (age, usage, annual miles)
- Driving behavior metrics (acceleration, braking events)
- Claims history (number and amount of claims)

## Styling

The dashboard uses Tailwind CSS for styling with:
- Responsive grid layouts
- Color-coded risk indicators
- Smooth animations and transitions
- Modern card-based design
- Accessibility-friendly components

## Error Handling

The dashboard includes comprehensive error handling:
- API connection status monitoring
- User-friendly error messages
- Loading states for better UX
- Fallback for missing environment variables

## Development

### Project Structure
```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── UserSearch.jsx         # User search functionality
│   ├── CreditScoreCard.jsx    # Credit score display
│   ├── TelematicsCard.jsx     # Telematics data display
│   └── StatsOverview.jsx      # Statistics overview
├── utils/
│   └── api.js                 # API configuration and utilities
├── App.jsx                    # Root component
└── main.jsx                   # Application entry point
```

### Customization

To modify the API configuration:
1. Update the `.env` file with your backend URL
2. Modify `src/utils/api.js` if you need to add new endpoints
3. Components automatically use the centralized API configuration
