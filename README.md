# Air Canada - Flight Routes API

This project implements a modular and extensible Flight Routes API based on the provided technical use case.

It exposes two endpoints:
- `/flightRoutes` → retrieves flight offers between two airports.
- `/flightRoutesWithHotels` → retrieves flight offers along with integrated hotel data near the destination.

The API is designed with clean separation of concerns and a flexible architecture, allowing for future enhancements such as adding new providers, caching, or additional endpoints.

---

## Live Deployment

The API is live and available here:

  Base URL: [https://aircanada-partner-integration.onrender.com](https://aircanada-partner-integration.onrender.com)

### Endpoints

- [`/flightRoutes`](https://aircanada-partner-integration.onrender.com/flightRoutes)
- [`/flightRoutesWithHotels`](https://aircanada-partner-integration.onrender.com/flightRoutesWithHotels)
- [`/api-docs`](https://aircanada-partner-integration.onrender.com/api-docs) → Swagger API documentation

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
  config.js                 # Centralized config loader (.env)
/controllers
  flightRoutesController.js # Two endpoints: /flightRoutes and /flightRoutesWithHotels
/middlewares
  correlationIdMiddleware.js
/providers
  index.js                  # Provider factory (dynamic injection)
  amadeusProvider.js        # Current implementation with Amadeus
/services
  flightRoutesService.js    # Orchestration layer
/utils
  httpClient.js             # Reusable HTTP client with timeout
  logger.js                 # Basic structured logger
/swagger.json
index.js
.env
package.json
README.md
```

---

## How to run locally

### Prerequisites
- Node.js 16.x or newer
- NPM

### Installation

```bash
npm install
```

### Running the API

```bash
npm start
```

The API will be available at:

```
http://localhost:3000
```

Swagger API Docs:

```
http://localhost:3000/api-docs
```

---

## Endpoints

### `GET /flightRoutes`

Fetches flight offers between origin and destination airports.

**Query parameters**:
- `origin` → origin airport code (IATA)
- `destination` → destination airport code (IATA)
- `departureDate` → departure date (YYYY-MM-DD)
- `adults` → number of adult passengers

**Example**:

```bash
curl 'https://aircanada-partner-integration.onrender.com/flightRoutes?origin=YYZ&destination=YVR&departureDate=2025-06-10&adults=1'
```

---

### `GET /flightRoutesWithHotels`

Fetches flight offers between origin and destination airports + hotel listings near destination.

**Query parameters**:
- Same as `/flightRoutes`.

**Example**:

```bash
curl 'https://aircanada-partner-integration.onrender.com/flightRoutesWithHotels?origin=YYZ&destination=YVR&departureDate=2025-06-10&adults=1'
```

---

## Key Features

- **Modular provider architecture** → can easily add new providers in future (Sabre, etc.)
- **Provider injected via config** → no hardcoding, clean separation of concerns
- **Global error handling** → unhandledRejection, uncaughtException, and Express error middleware
- **CorrelationId middleware** → each request is traced for better observability
- **Swagger documentation** → exposed at `/api-docs` for easy testing and partner integration
- **Reusable HTTP client** → timeout configurable
- **Configuration fully externalized** → `.env` used for all keys, timeouts, etc.
- **Live deployment with CI/CD** → Deployed to Render with auto-updates on GitHub push

---

## Final Notes

The architecture was deliberately designed to be extensible and production-ready:
- Clear layering between Controller / Service / Provider
- Dynamic provider selection at runtime
- No hardcoded secrets or constants
- Easily testable, observable, maintainable
- Deployed to public endpoint with CI/CD enabled

This API can serve both Air Canada's internal systems and potential partner integrations as it evolves.

---

## Author

Rahul Somanathan
