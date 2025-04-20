# Text‑to‑Video Generator

This repository provides a full-stack scaffold for a text‑to‑video web application, featuring:

- **Custom Avatars / Scenes** via image‑to‑video API
- **Text‑to‑Speech** voice‑over generation using AWS Polly
- **Domain‑Specific Presets** (e.g., cartoons, product demos)
- **Real‑Time Progress Bar** and status polling

---

## Prerequisites

1. **Node.js & npm** (v14+)
2. **Redis** server running (for Bull queues)
3. **AWS account** with Polly access
4. **Stability.ai** API key (or other text2video provider)
5. **Environment** with access to the internet for API calls

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your‑username/text‑to‑video.git
cd text‑to‑video
```

### 2. Environment Variables

Create a `.env` file at the root of the project and add:

```ini
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Stability API
STABILITY_KEY=your_stability_api_key

# AWS Polly
AWS_REGION=us‑east‑1
AWS_ACCESS_KEY_ID=your_aws_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

---

## Server Setup

All server code lives under `server/`.

1. Install dependencies

   ```bash
   cd server
   npm install
   ```

2. Run the Express API

   - **Main server** (ports API endpoints and static videos):
     ```bash
     npm start
     ```

   - **Worker** (processes text2video & TTS jobs):
     ```bash
     npm run worker
     ```

3. Verify Redis is running and accessible at `REDIS_HOST:REDIS_PORT`.

---

## Client Setup

All front‑end code lives under `client/` (built with Vite + React).

1. Install dependencies

   ```bash
   cd client
   npm install
   ```

2. Run in development mode

   ```bash
   npm run dev
   ```

3. Build for production

   ```bash
   npm run build
   ```

4. Preview the production build

   ```bash
   npm run serve
   ```

> The client expects the server API to be at `/api/video` (proxied by Vite in dev).

---

## Usage

1. Open your browser to `http://localhost:5173` (default Vite port).
2. Enter your video **text prompt**, optional **avatar image URL**, select a **preset**, and choose a **voice**.
3. Click **Generate**. Watch the **status** and **progress bar**.
4. When complete, the video player will appear to preview/download your video.

---

## Deployment

### Docker & docker‑compose (optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  redis:
    image: redis:6
    ports:
      - '6379:6379'

  server:
    build: ./server
    environment:
      - REDIS_HOST=redis
      - STABILITY_KEY=${STABILITY_KEY}
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - redis
    ports:
      - '4000:4000'
    command: npm start

  worker:
    build: ./server
    environment:
      - REDIS_HOST=redis
      - STABILITY_KEY=${STABILITY_KEY}
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - redis
    command: npm run worker

  client:
    build: ./client
    ports:
      - '5173:5173'
    command: npm run dev
```

Then:

```bash
docker-compose up --build
```

### Production Tips

- Serve the `client/dist` build via a CDN or Nginx.
- Host the server on a managed Node.js service or container platform.
- Use a secure Redis instance (authentication/VPC).
- Store large video outputs in S3 and serve via CloudFront.
- Monitor queue health and scale workers based on load.

---

## Fine‑Tuning & Extensions

- **Custom Avatars / Scenes**: swap in your own image‑to‑video model or 3D engine.
- **Text‑to‑Speech** Voices: adjust AWS Polly parameters or use another TTS provider.
- **Domain‑Specific Models**: train/fine‑tune models for cartoons, demos, etc., and reference via `domainPreset`.
- **UI Enhancements**: add keyframe preview, modal presets gallery, or user authentication.

---

## License & Credits

MIT © Your Name

