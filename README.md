# Portfolio Maker

Portfolio Maker is an AI-powered tool that will help users create a personalized portfolio website from their professional information, resume, and a target job description. This repository currently contains only the initial frontend and backend foundations; product features will be added in later iterations.

## High-level architecture

- **Frontend:** React, TypeScript, Vite, and Tailwind CSS in `frontend/`
- **Backend:** Python and FastAPI in `backend/`, organized into an application package with API routes
- **API:** Backend endpoints are prefixed with `/api`

The frontend and backend are independent applications and can be installed, run, and built separately.

## Development setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173` by default.

To create a production build:

```bash
npm run build
```

### Backend

Create and activate a virtual environment from the repository root:

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000` by default. Verify it with:

```text
GET http://localhost:8000/api/health
```

It returns:

```json
{"status": "ok"}
```
