# BigNoodle CORS Proxy

A simple proxy server that adds CORS headers to requests to the BigNoodle Agent API.

## How it works

This proxy server forwards requests to the BigNoodle Agent API and adds CORS headers to the responses, allowing the frontend to communicate with the backend without CORS errors.

## Usage

### Local Development

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

3. The server will run on port 3001 by default. You can change this by setting the PORT environment variable.

### API Endpoints

- `/health`: Health check endpoint
- `/api/*`: Proxied API endpoints (forwards to the BigNoodle Agent API)

### Example

To make a request to `https://agno-agent-api-tabi-39e2dc704f77.herokuapp.com/v1/playground/status`, use:

```
GET http://localhost:3001/api/v1/playground/status
```

## Deployment

### Render

1. Push this code to a GitHub repository
2. Create a new Web Service on Render
3. Connect to your GitHub repository
4. Configure the service:
   - Name: bignoodle-cors-proxy
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

## Frontend Integration

Update your frontend to use the proxy URL instead of directly calling the Heroku backend:

```javascript
// Before
const API_URL = 'https://agno-agent-api-tabi-39e2dc704f77.herokuapp.com';

// After
const API_URL = 'https://your-proxy-name.onrender.com/api';
``` 