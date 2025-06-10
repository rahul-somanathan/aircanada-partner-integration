# Air Canada - Flight Routes API

This project implements a modular and extensible Flight Routes API based on the provided technical use case.

It exposes two endpoints:
- `/flightRoutes` → retrieves flight offers between two airports.
- `/flightRoutesWithHotels` → retrieves flight offers along with integrated hotel data near the destination.

The API is designed with clean separation of concerns and a flexible architecture, allowing for future enhancements such as adding new providers, caching, or additional endpoints.

---

## Live Deployment

The API is live and available here:

👉 Base URL: [https://aircanada-partner-integration.onrender.com](https://aircanada-partner-integration.onrender.com)

### Endpoints

- [`GET https://aircanada-partner-integration.onrender.com/flightRoutes`](https://aircanada-partner-integration.onrender.com/flightRoutes)
- [`GET https://aircanada-partner-integration.onrender.com/flightRoutesWithHotels`](https://aircanada-partner-integration.onrender.com/flightRoutesWithHotels)
- [`GET https://aircanada-partner-integration.onrender.com/health`](https://aircanada-partner-integration.onrender.com/health) → Health check
- [`https://aircanada-partner-integration.onrender.com/api-docs`](https://aircanada-partner-integration.onrender.com/api-docs) → Swagger API documentation


---

## Why this architecture?

The goal was to implement an API that is:
- Easy to extend (e.g. add new providers, enrich responses)
- Secure and configurable (all config loaded from `.env`)
- Observable and debuggable (correlation IDs, global error handling)
- Maintainable and testable (layered architecture with clear roles)
- Ready to deploy in production environments (deployed to Render with CI/CD)

---

## Project Structure

```
/config
  config.js
/controllers
  flightRoutesController.js
/middlewares
  correlationIdMiddleware.js
/providers
  index.js
  amadeusProvider.js
/services
  flightRoutesService.js
/utils
  httpClient.js
  logger.js
/swagger.json
index.js
.env
package.json
README.md
```

---

## Endpoints

### `GET /flightRoutes`

Fetches flight offers between origin and destination airports.

### `GET /flightRoutesWithHotels`

Fetches flight offers between origin and destination airports + hotel listings near destination.

### `GET /health`

Basic health check endpoint. Returns `{"status": "ok"}`.

---

## Production Readiness Features

The API implements key production readiness patterns:

- **Structured logging** → Winston-based → easy to parse in log systems
- **/health endpoint** → for load balancer and monitoring checks
- **Request timeout** → prevents hanging requests
- **Rate limiting** → protects API from abuse (configurable via .env)
- **Standardized error responses** → with correlationId for traceability
- **Global process error handlers** → catch unhandled errors
- **All config externalized** → no magic numbers in code
- **Deployed with CI/CD on Render**

---

## Environment Variables

Create a `.env` file in the project root with the following structure:

```env
FLIGHT_PROVIDER=amadeus
PORT=3000
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret
AMADEUS_BASE_URL=https://test.api.amadeus.com
HTTP_TIMEOUT=5000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
REQUEST_TIMEOUT_MS=10000
