# MEAN Stack Project Setup

This workspace contains a basic MEAN stack scaffold:

- **backend/** - Node.js + Express server with MongoDB (Mongoose)
- **frontend/** - Angular application

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env  # set environment variables (BASE_URL/IPINFO_TOKEN)
npm run dev            # start server with nodemon
```

### API

* `POST /api/url` – create a short link by sending JSON `{ "original": "https://..." }`
  response: `{ short, code }`
* `GET /:code` – redirect to the original URL; visits are logged with IP, time and country
* `GET /api/url/:code/stats` – retrieve analytics for the given code

### Frontend

```bash
cd frontend
npm install
npm run start:proxy    # run Angular with API proxy to backend
```

## Notes

- Ensure MongoDB is running locally or adjust `MONGO_URI` in `.env`.
- The proxy configuration forwards `/api` calls to the backend.
