"""API routes for image generation."""

from fastapi import APIRouter, HTTPException

from app.agents import image_agent
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

router = APIRouter(prefix="/api", tags=["generation"])


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
        # For now, create a mock upscaled response
        # In production, integrate with an upscaling service
        from datetime import datetime

        from app.models import GeneratedImage, ImageStatus

        upscaled_image = GeneratedImage(
            id=f"upscale-{request.image_id}",
            url=request.image_url,  # Would be replaced with actual upscaled URL
            prompt="Upscaled image",
            width=2048,
            height=2048,
            model="upscaler",
            created_at=datetime.utcnow(),
            status=ImageStatus.COMPLETED,
        )

        return UpscaleResponse(
            message="Image upscaled successfully!",
            image=upscaled_image,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/variation", response_model=VariationResponse)
async def create_variation(request: VariationRequest) -> VariationResponse:
    """Create variations of an image."""
    try:
        # Prepare initial state for variation
        initial_state = {
            "messages": [],
            "prompt": request.prompt,
            "settings": GenerationSettings(number_of_images=4),
            "images": [],
            "action": "variation",
            "error": None,
        }

        # Run the agent
        result = await image_agent.ainvoke(initial_state)

        if result.get("error"):
            raise HTTPException(status_code=500, detail=result["error"])

        images = result.get("images", [])

        return VariationResponse(
            message=f"Generated {len(images)} variations",
            images=images,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/remix", response_model=RemixResponse)
async def remix_image(request: RemixRequest) -> RemixResponse:
    """Remix an image with a new prompt."""
    try:
        # Prepare initial state for remix
        initial_state = {
            "messages": [],
            "prompt": request.prompt,
            "settings": GenerationSettings(number_of_images=4),
            "images": [],
            "action": "generate",  # Remix is essentially a new generation with the prompt
            "error": None,
        }

        # Run the agent
        result = await image_agent.ainvoke(initial_state)

        if result.get("error"):
            raise HTTPException(status_code=500, detail=result["error"])

        images = result.get("images", [])

        return RemixResponse(
            message=f"Generated {len(images)} remixed images",
            images=images,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
