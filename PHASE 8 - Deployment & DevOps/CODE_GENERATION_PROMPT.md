# PHASE 8 — Deployment & DevOps

## Objective
Containerize all services with Docker, configure Render deployment (free tier for development), set up production VPS with Coolify, and configure CI/CD pipeline. Make the app deployable with one command.

## Prerequisites
- Phases 0-7 complete (all code written and tested)
- GitHub repository created

## Infrastructure Strategy

```
Development (Free - $0/mo)         →  Production (VPS - ~$10-25/mo)
┌──────────────────┐                  ┌──────────────────────┐
│ Render.com       │                  │ Hetzner VPS (CX22)   │
│ - Frontend       │                  │ - Ubuntu 22.04       │
│ - Admin          │                  │ - 2 vCPU, 4GB RAM    │
│ - Backend        │                  │ - 40GB SSD           │
│ (spins down idle)│                  │                      │
├──────────────────┤                  ├──────────────────────┤
│ Supabase (Free)  │                  │ Coolify (self-hosted)│
│ - PostgreSQL     │    ── Migrate ──▶│ - Docker Compose     │
│ - Auth (optional)│                  │ - Auto SSL (Let's    │
└──────────────────┘                  │   Encrypt)           │
                                      │ - Auto-deploy from   │
                                      │   GitHub             │
                                      │ - One-click backups  │
                                      └──────────────────────┘
```

## Files to Create/Update

### 1. Docker Configuration

**`Dockerfile`** — Multi-stage build (from Phase 0, update if needed):
```dockerfile
# Stage 1: Backend
FROM node:20-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "src/index.js"]

# Stage 2: Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 3: Admin
FROM node:20-alpine AS admin-build
WORKDIR /app
COPY admin/package*.json ./
RUN npm ci
COPY admin/ .
RUN npm run build

# Stage 4: Nginx (serves frontend + admin + proxies API)
FROM nginx:alpine
COPY --from=frontend-build /app/dist /usr/share/nginx/html/student
COPY --from=admin-build /app/dist /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`docker-compose.yml`** (update from Phase 0) — Full stack orchestration:
- postgres:16-alpine (database)
- backend (builds from Dockerfile, depends on postgres)
- nginx (builds from Dockerfile, ports 80:80, depends on backend)
- Named volume: postgres_data
- All environment variables loaded from .env

**`nginx.conf`** — Nginx configuration:
```nginx
events { worker_connections 1024; }

http {
  server {
    listen 80;
    
    # Student frontend
    location / {
      root /usr/share/nginx/html/student;
      try_files $uri $uri/ /index.html;
    }
    
    # Admin panel
    location /admin {
      alias /usr/share/nginx/html/admin;
      try_files $uri $uri/ /admin/index.html;
    }
    
    # API proxy
    location /api {
      proxy_pass http://backend:5000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
```

### 2. Render Deployment

**`render.yaml`** (update from Phase 0) — Render blueprint config:
- Backend web service: Node environment, build command with prisma generate, start command
- Frontend static site: static site, build command, publish path ./frontend/dist
- Admin static site: static site, build command, publish path ./admin/dist
- PostgreSQL database: free plan
- Environment variables with sync: false for secrets

**`.env.production`** — Create template:
```
NODE_ENV=production
FRONTEND_URL=https://your-app.onrender.com
ADMIN_URL=https://your-admin.onrender.com
PORT=5000
JWT_EXPIRES_IN=7d
```

### 3. Coolify Setup

**`coolify.json`** — Coolify deployment config (optional but documented):
```json
{
  "name": "German Learning App",
  "services": {
    "postgres": {
      "type": "postgresql",
      "version": "16",
      "configuration": {
        "POSTGRES_DB": "germanapp",
        "POSTGRES_USER": "germanapp"
      }
    },
    "backend": {
      "type": "dockerfile",
      "dockerfilePath": "./Dockerfile",
      "target": "backend",
      "ports": ["5000:5000"]
    },
    "frontend": {
      "type": "dockerfile",
      "dockerfilePath": "./Dockerfile",
      "target": "nginx",
      "ports": ["80:80", "443:443"]
    }
  }
}
```

### 4. CI/CD Configuration

**`.github/workflows/deploy.yml`** — GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test Backend
        run: cd backend && npm ci && npm test
      - name: Build Frontend
        run: cd frontend && npm ci && npm run build
      - name: Build Admin
        run: cd admin && npm ci && npm run build
  deploy-render:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### 5. Database Setup Scripts

**`backend/src/prisma/seed.js`** — Database seed script:
- Creates admin user (admin@germanapp.com / Admin123!)
- Creates sample courses (German Basics A1, Everyday Conversations A2, Grammar Deep Dive B1, etc.)
- Creates sample lessons for each course
- Creates sample exercises and quizzes
- Creates initial prompt templates:
  - lessonGeneration
  - quizGeneration
  - conversation
  - vocabulary
  - writingEval
  - speakingEval
  - readingEval
  - hearingEval
- Creates app default settings
- Seed command: `npx prisma db seed`

**`backend/package.json`** — Add seed config:
```json
"prisma": {
  "seed": "node src/prisma/seed.js"
}
```

### 6. Health Check Endpoint

**`backend/src/routes/health.js`** — Health check:
- GET /api/health — Returns { status: 'ok', timestamp, uptime, db: 'connected'|'error' }
- Used by Render/Docker for health monitoring

### 7. Monitoring Setup

**`backend/src/utils/aiCostTracker.js`** — AI usage cost tracking:
- Tracks daily API usage per provider
- Calculates estimated costs
- Alerts when approaching free tier limits
- Methods: trackUsage(provider, tokens), getDailyStats(), getMonthlyProjection()

### 8. Auto-Update System

Build a built-in update manager in the admin panel. Admins can upload new version packages and trigger zero-downtime updates — like a CMS self-update mechanism.

#### Backend — Update Controller

**`backend/src/controllers/admin/updateController.js`** — Version management API:
- GET /api/admin/updates — List all versions (current, pending, history)
- GET /api/admin/updates/check — Check for available updates against a remote manifest
- POST /api/admin/updates/upload — Upload a new version package (.zip containing build artifacts + migration scripts)
- POST /api/admin/updates/:id/deploy — Deploy a specific uploaded version
- POST /api/admin/updates/:id/rollback — Rollback to previous version (preserves data)
- GET /api/admin/updates/:id/logs — Get deployment log for a version
- GET /api/admin/updates/status — Current deployment status (idle, deploying, rolling back, failed)

**`backend/src/routes/admin/updates.js`** — All routes protected by super-admin auth + IP whitelist.

**`backend/src/utils/updateManager.js`** — Core update engine:
- `extractPackage(versionId)` — Unzips uploaded package to staging directory
- `runMigrations(versionId)` — Executes any SQL/data migration scripts included in the package
- `swapBlueGreen(versionId)` — Blue-green deployment: spins up new container/process, health-checks it, then swaps traffic
- `rollback(versionId)` — Reverts to previous version, runs rollback migrations
- `validatePackage(versionId)` — Checks package integrity (hash, manifest, structure)
- `getDeploymentSteps(versionId)` — Returns ordered list of deployment steps with progress

**`backend/src/prisma/schema.prisma`** — Add Version model:
```prisma
model AppVersion {
  id            String   @id @default(cuid())
  version       String   // e.g. "1.2.0"
  description   String   // changelog / release notes
  filePath      String   // path to uploaded .zip
  fileHash      String   // SHA-256 of package
  fileSize      Int      // bytes
  status        String   // pending | deploying | active | failed | rolled_back
  deployedAt    DateTime?
  rollbackedAt  DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deployLogs    String?  // JSON array of deployment step logs
  migrationStatus String? // pending | running | completed | failed
  createdBy     String   // admin ID who uploaded
}
```

#### Admin Panel — Update UI

**`admin/src/pages/updates/UpdateManager.jsx`** — Main update dashboard:
- Current version banner at top (e.g. "v1.2.0 — Active" with green badge)
- Upload new version card with drag-and-drop .zip uploader
- Upload form fields: Version Number (e.g. 1.3.0), Release Notes (textarea), Package file (.zip)
- Upload validation: checks for valid manifest.json inside .zip, shows preview of package contents
- Deploy button (with confirmation modal: "Deploy v1.3.0 to production?")
- Live deployment progress bar (steps: Extract → Validate → Backup → Migrate → Deploy → Health Check → Switch Traffic)
- Status indicator during deployment (spinner + current step name)
- Success/failure notification with logs link

**`admin/src/pages/updates/UploadVersion.jsx`** — Version upload form:
- Drag-and-drop zone with visual feedback (highlight on drag, checkmark on accept)
- Manual file picker fallback
- Version number input (auto-suggest next version from semver)
- Release notes editor with markdown support
- Upload progress percentage
- Validation errors: invalid format, missing manifest, hash mismatch

**`admin/src/pages/updates/VersionHistory.jsx`** — Version history table:
- Columns: Version, Description, Status (active/deployed/failed/rolled_back), Date, Deployed By, Actions
- Status badges with colors: green (active), blue (deployed), red (failed), yellow (rolled_back)
- Rollback button per version (only available on active version)
- Deploy log expandable row — shows step-by-step deployment timeline with timestamps
- Failed version shows error details and retry button
- Migration status per version

**`admin/src/api/updateAdminAPI.js`** — Axios calls:
- getVersions(), checkUpdates(), uploadVersion(formData), deployVersion(id), rollbackVersion(id), getVersionLogs(id), getDeployStatus()

**`admin/src/components/VersionUploader.jsx`** — Reusable upload component:
- Drag-and-drop interface with file type validation (.zip only, max 500MB)
- Progress indicator during upload
- Package preview (manifest content, file list inside zip)
- Upload complete → shows version details for confirmation

#### Zero-Downtime Strategy

The auto-update system uses a **blue-green deployment** pattern:
1. New version is extracted to a `/staging/v{version}/` directory
2. Database migrations run against a backup (with automatic rollback on failure)
3. New backend process starts on a different internal port
4. Health check pings the new process (retry 3 times, 5s apart)
5. Nginx config is hot-reloaded to point traffic to the new process
6. Old process stays alive for 60s (graceful shutdown, drains existing connections)
7. On failure: auto-rollback — nginx points back to old process, migration reverts

#### Data Safety Guarantee
- Every deployment creates a database backup before migrations
- Migrations are wrapped in transactions — failure = full rollback
- Uploaded media files (images, audio) are never modified during update
- User data (progress, accounts, chat history) is preserved across versions
- Rollback restores only app code and schema — never touches user data
- Version packages include a `rollback.sql` script for schema reversal

## Documentation

### 9. Deployment Guide (in README.md)

Update README.md with comprehensive deployment section:

**Development Deployment (Free - Render):**
1. Fork/push to GitHub
2. Create Render account
3. Create PostgreSQL database in Render
4. Create Backend web service (connect GitHub repo)
5. Create Frontend static site
6. Create Admin static site
7. Configure environment variables
8. Set up custom domain (optional)

**Production Deployment (VPS + Coolify):**
1. Provision Hetzner VPS (CX22: €4.99/mo)
2. SSH in and install Docker + Coolify
3. Configure Coolify dashboard
4. Connect GitHub repository
5. Deploy with one click
6. Configure SSL (automatic via Coolify + Let's Encrypt)
7. Set up automatic backups

## Validation
1. `docker compose build` succeeds without errors
2. `docker compose up` starts all services
3. Frontend loads at http://localhost
4. Admin panel loads at http://localhost/admin
5. API responds at http://localhost/api/health
6. `npx prisma db seed` populates database
7. GitHub Actions workflow validates
8. `npm run build` for all apps succeeds
