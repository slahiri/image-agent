# ImageAI - Conversational Image Generation

A Midjourney-like conversational interface for AI image generation. Built with Next.js, shadcn/ui, and a modular Python/LangGraph backend.

## Features

- **Chat Interface**: Conversational UI similar to Midjourney/Discord
- **Image Generation**: Generate images from text prompts
- **Image Actions**: Upscale, create variations, remix with new prompts
- **Session Management**: Multiple chat sessions with history
- **Modular Tools**: Extensible tool system for easy integration with different APIs

## Prerequisites

- **Node.js** 18+ with **pnpm** (`npm install -g pnpm`)
- **Python** 3.10+ with **uv** (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

## Quick Start

### Frontend Only (Mock Mode)

The frontend works standalone with mock images for testing:

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000 and start generating images!

### Full Stack

1. **Start the backend:**
```bash
cd backend
uv sync
uv run python -m app.main
```

2. **Start the frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

## Package Managers

| Component | Package Manager | Why |
|-----------|-----------------|-----|
| Frontend | **pnpm** | Fast, efficient disk space, strict dependency resolution |
| Backend | **uv** | Ultra-fast Python package manager from Astral (ruff creators) |

### Common Commands

**Frontend (pnpm):**
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Run ESLint
```

**Backend (uv):**
```bash
uv sync               # Install dependencies
uv run python -m app.main    # Run server
uv add <package>      # Add dependency
uv run pytest         # Run tests
```

## Project Structure

```
├── frontend/                 # Next.js 14 + shadcn/ui
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── api/         # API routes (with mock fallback)
│   │   │   └── page.tsx     # Main chat page
│   │   ├── components/
│   │   │   ├── chat/        # Chat components
│   │   │   │   ├── chat-input.tsx
│   │   │   │   ├── chat-message.tsx
│   │   │   │   ├── image-card.tsx
│   │   │   │   ├── image-grid.tsx
│   │   │   │   ├── image-dialog.tsx
│   │   │   │   ├── message-list.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── use-chat.ts  # Chat state management
│   │   └── types/
│   │       └── chat.ts      # TypeScript types
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── backend/                  # Python + FastAPI + LangGraph
│   ├── app/
│   │   ├── agents/          # LangGraph agent
│   │   ├── models/          # Pydantic schemas
│   │   ├── routes/          # API endpoints
│   │   └── tools/           # Modular tool system
│   │       ├── base.py      # Tool base classes
│   │       └── image_tools.py
│   ├── pyproject.toml
│   └── uv.lock
│
└── README.md
```

## Available Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate images from text prompts |
| `upscale_image` | Upscale images 2x or 4x |
| `create_variation` | Create variations of an image |
| `remix_image` | Transform image with new prompt |
| `inpaint_image` | Edit specific regions with masking |
| `remove_background` | Remove image background |
| `style_transfer` | Apply artistic styles |

## API Endpoints

### Frontend (Next.js)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate images from prompt |
| POST | `/api/upscale` | Upscale an image |
| POST | `/api/variation` | Create image variations |
| POST | `/api/remix` | Remix with new prompt |

### Backend (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | List available tools |
| POST | `/api/generate` | Generate images |
| POST | `/api/upscale` | Upscale image |
| POST | `/api/variation` | Create variations |
| POST | `/api/remix` | Remix image |
| POST | `/api/tool/{name}` | Execute any tool |
| GET | `/api/health` | Health check |

## Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
BACKEND_URL=http://localhost:8000
```

### Backend Environment Variables

Create `backend/.env`:

```env
# API Keys (optional - uses mock if not set)
OPENAI_API_KEY=your-key
REPLICATE_API_KEY=your-key
ANTHROPIC_API_KEY=your-key

# Server
API_HOST=0.0.0.0
API_PORT=8000
```

## Extending with Real APIs

The tool system is designed for easy extension. To add a real implementation:

1. **Create a new tool class** in `backend/app/tools/`:

```python
from .base import Tool, ToolResult

class RealGenerateImageTool(Tool):
    name = "generate_image"

    async def execute(self, prompt: str, **kwargs) -> ToolResult:
        # Call your API here (Replicate, OpenAI, etc.)
        response = await call_real_api(prompt)
        return ToolResult(success=True, data={"images": response})
```

2. **Register in the tool registry** in `image_tools.py`

3. **Or use MCP**: The tool interface is compatible with Model Context Protocol

## UI Features

- **Settings Bar**: Aspect ratio, number of images, model selection
- **Image Actions**: Hover over images to upscale, create variations, remix, download
- **Fullscreen View**: Click images to see details and metadata
- **Session History**: Sidebar with chat history grouped by date
- **Dark Mode**: Enabled by default

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide icons
- pnpm (package manager)

**Backend:**
- Python 3.10+
- FastAPI
- LangGraph
- Pydantic
- uv (package manager)

## License

MIT
