"""API routes for image generation."""

from fastapi import APIRouter, HTTPException

from app.agents import image_agent, get_available_tools
from app.models import (
    GenerateRequest,
    GenerateResponse,
    GenerationSettings,
    RemixRequest,
    RemixResponse,
    UpscaleRequest,
    UpscaleResponse,
    VariationRequest,
    VariationResponse,
)
from app.tools import get_tool

router = APIRouter(prefix="/api", tags=["generation"])


@router.get("/tools")
async def list_tools():
    """List all available image tools."""
    return {
        "tools": get_available_tools(),
        "count": len(get_available_tools()),
    }


@router.post("/generate", response_model=GenerateResponse)
async def generate_images(request: GenerateRequest) -> GenerateResponse:
    """Generate images from a text prompt."""
    try:
        # Prepare initial state
        initial_state = {
            "messages": [],
            "prompt": request.prompt,
            "settings": request.settings or GenerationSettings(),
            "images": [],
            "action": "generate",
            "tool_name": None,
            "tool_args": None,
            "error": None,
        }

        # Run the agent
        result = await image_agent.ainvoke(initial_state)

        if result.get("error"):
            raise HTTPException(status_code=500, detail=result["error"])

        images = result.get("images", [])

        return GenerateResponse(
            message=f"Generated {len(images)} images for: \"{request.prompt}\"",
            images=images,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upscale", response_model=UpscaleResponse)
async def upscale_image(request: UpscaleRequest) -> UpscaleResponse:
    """Upscale an image to higher resolution."""
    try:
        # Use the upscale tool directly
        tool = get_tool("upscale_image")
        if not tool:
            raise HTTPException(status_code=500, detail="Upscale tool not available")

        result = await tool.execute(
            image_url=request.image_url,
            scale=2,
        )

        if not result.success:
            raise HTTPException(status_code=500, detail=result.error)

        return UpscaleResponse(
            message=result.data.get("message", "Image upscaled successfully!"),
            image=result.data.get("image"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/variation", response_model=VariationResponse)
async def create_variation(request: VariationRequest) -> VariationResponse:
    """Create variations of an image."""
    try:
        # Use the variation tool directly
        tool = get_tool("create_variation")
        if not tool:
            raise HTTPException(status_code=500, detail="Variation tool not available")

        result = await tool.execute(
            image_url=request.image_url,
            prompt=request.prompt,
            num_variations=4,
        )

        if not result.success:
            raise HTTPException(status_code=500, detail=result.error)

        return VariationResponse(
            message=result.data.get("message", "Created variations"),
            images=result.data.get("images", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/remix", response_model=RemixResponse)
async def remix_image(request: RemixRequest) -> RemixResponse:
    """Remix an image with a new prompt."""
    try:
        # Use the remix tool directly
        tool = get_tool("remix_image")
        if not tool:
            raise HTTPException(status_code=500, detail="Remix tool not available")

        result = await tool.execute(
            image_url=request.image_url,
            prompt=request.prompt,
        )

        if not result.success:
            raise HTTPException(status_code=500, detail=result.error)

        return RemixResponse(
            message=result.data.get("message", "Remixed image"),
            images=result.data.get("images", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tool/{tool_name}")
async def execute_tool(tool_name: str, params: dict):
    """Execute any tool by name with given parameters."""
    try:
        tool = get_tool(tool_name)
        if not tool:
            raise HTTPException(
                status_code=404,
                detail=f"Tool '{tool_name}' not found. Use GET /api/tools to see available tools.",
            )

        result = await tool.execute(**params)

        return {
            "success": result.success,
            "data": result.data,
            "error": result.error,
            "metadata": result.metadata,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
