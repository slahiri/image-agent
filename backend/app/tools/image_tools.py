"""Image generation and modification tools with mock implementations."""

import uuid
from datetime import datetime
from typing import Any, Optional

from .base import MockTool, ToolResult


class GenerateImageTool(MockTool):
    """Generate images from a text prompt."""

    name = "generate_image"
    description = "Generate one or more images from a text description/prompt"
    parameters = {
        "type": "object",
        "properties": {
            "prompt": {
                "type": "string",
                "description": "Detailed description of the image to generate",
            },
            "negative_prompt": {
                "type": "string",
                "description": "What to avoid in the image",
            },
            "num_images": {
                "type": "integer",
                "description": "Number of images to generate (1-4)",
                "default": 4,
            },
            "width": {
                "type": "integer",
                "description": "Image width in pixels",
                "default": 1024,
            },
            "height": {
                "type": "integer",
                "description": "Image height in pixels",
                "default": 1024,
            },
            "model": {
                "type": "string",
                "description": "Model to use for generation",
                "enum": ["flux", "sdxl", "dall-e-3"],
                "default": "flux",
            },
        },
        "required": ["prompt"],
    }

    async def execute(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        num_images: int = 4,
        width: int = 1024,
        height: int = 1024,
        model: str = "flux",
        **kwargs,
    ) -> ToolResult:
        """Generate images (mock implementation)."""
        await self._simulate_delay()

        images = []
        for i in range(num_images):
            seed = int(datetime.now().timestamp() * 1000) + i
            images.append({
                "id": f"img-{uuid.uuid4().hex[:8]}",
                "url": f"https://picsum.photos/seed/{seed}/{width}/{height}",
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "width": width,
                "height": height,
                "model": model,
                "seed": seed,
                "created_at": datetime.utcnow().isoformat(),
                "status": "completed",
            })

        return ToolResult(
            success=True,
            data={
                "images": images,
                "message": f"Generated {num_images} images",
            },
            metadata={"model": model, "mock": True},
        )


class UpscaleImageTool(MockTool):
    """Upscale an image to higher resolution."""

    name = "upscale_image"
    description = "Increase the resolution of an image (2x or 4x)"
    parameters = {
        "type": "object",
        "properties": {
            "image_url": {
                "type": "string",
                "description": "URL of the image to upscale",
            },
            "scale": {
                "type": "integer",
                "description": "Upscale factor (2 or 4)",
                "enum": [2, 4],
                "default": 2,
            },
        },
        "required": ["image_url"],
    }

    async def execute(
        self,
        image_url: str,
        scale: int = 2,
        **kwargs,
    ) -> ToolResult:
        """Upscale image (mock implementation)."""
        await self._simulate_delay()

        # Parse original dimensions from URL if possible, otherwise use defaults
        original_width = 1024
        original_height = 1024

        new_width = original_width * scale
        new_height = original_height * scale

        seed = int(datetime.now().timestamp() * 1000)

        return ToolResult(
            success=True,
            data={
                "image": {
                    "id": f"upscale-{uuid.uuid4().hex[:8]}",
                    "url": f"https://picsum.photos/seed/{seed}/{new_width}/{new_height}",
                    "original_url": image_url,
                    "width": new_width,
                    "height": new_height,
                    "scale": scale,
                    "created_at": datetime.utcnow().isoformat(),
                    "status": "completed",
                },
                "message": f"Upscaled image {scale}x to {new_width}x{new_height}",
            },
            metadata={"scale": scale, "mock": True},
        )


class CreateVariationTool(MockTool):
    """Create variations of an existing image."""

    name = "create_variation"
    description = "Generate variations of an image while keeping the overall style and composition"
    parameters = {
        "type": "object",
        "properties": {
            "image_url": {
                "type": "string",
                "description": "URL of the source image",
            },
            "prompt": {
                "type": "string",
                "description": "Original or modified prompt for the variation",
            },
            "num_variations": {
                "type": "integer",
                "description": "Number of variations to create",
                "default": 4,
            },
            "variation_strength": {
                "type": "number",
                "description": "How different the variations should be (0.0-1.0)",
                "default": 0.5,
            },
        },
        "required": ["image_url", "prompt"],
    }

    async def execute(
        self,
        image_url: str,
        prompt: str,
        num_variations: int = 4,
        variation_strength: float = 0.5,
        **kwargs,
    ) -> ToolResult:
        """Create variations (mock implementation)."""
        await self._simulate_delay()

        images = []
        for i in range(num_variations):
            seed = int(datetime.now().timestamp() * 1000) + i + 100
            images.append({
                "id": f"var-{uuid.uuid4().hex[:8]}",
                "url": f"https://picsum.photos/seed/{seed}/1024/1024",
                "prompt": prompt,
                "source_url": image_url,
                "variation_strength": variation_strength,
                "width": 1024,
                "height": 1024,
                "created_at": datetime.utcnow().isoformat(),
                "status": "completed",
            })

        return ToolResult(
            success=True,
            data={
                "images": images,
                "message": f"Created {num_variations} variations",
            },
            metadata={"variation_strength": variation_strength, "mock": True},
        )


class RemixImageTool(MockTool):
    """Remix an image with a new prompt while preserving some elements."""

    name = "remix_image"
    description = "Transform an image based on a new prompt while keeping structural elements"
    parameters = {
        "type": "object",
        "properties": {
            "image_url": {
                "type": "string",
                "description": "URL of the source image",
            },
            "prompt": {
                "type": "string",
                "description": "New prompt describing the desired transformation",
            },
            "preserve_structure": {
                "type": "boolean",
                "description": "Whether to preserve the overall structure/layout",
                "default": True,
            },
        },
        "required": ["image_url", "prompt"],
    }

    async def execute(
        self,
        image_url: str,
        prompt: str,
        preserve_structure: bool = True,
        **kwargs,
    ) -> ToolResult:
        """Remix image (mock implementation)."""
        await self._simulate_delay()

        images = []
        for i in range(4):
            seed = int(datetime.now().timestamp() * 1000) + i + 200
            images.append({
                "id": f"remix-{uuid.uuid4().hex[:8]}",
                "url": f"https://picsum.photos/seed/{seed}/1024/1024",
                "prompt": prompt,
                "source_url": image_url,
                "preserve_structure": preserve_structure,
                "width": 1024,
                "height": 1024,
                "created_at": datetime.utcnow().isoformat(),
                "status": "completed",
            })

        return ToolResult(
            success=True,
            data={
                "images": images,
                "message": f"Remixed image with prompt: {prompt[:50]}...",
            },
            metadata={"preserve_structure": preserve_structure, "mock": True},
        )


class InpaintImageTool(MockTool):
    """Inpaint/edit specific regions of an image."""

    name = "inpaint_image"
    description = "Edit specific regions of an image by masking and regenerating"
    parameters = {
        "type": "object",
        "properties": {
            "image_url": {
                "type": "string",
                "description": "URL of the source image",
            },
            "mask_url": {
                "type": "string",
                "description": "URL of the mask image (white = edit, black = keep)",
            },
            "prompt": {
                "type": "string",
                "description": "Description of what to generate in the masked region",
            },
        },
        "required": ["image_url", "mask_url", "prompt"],
    }

    async def execute(
        self,
        image_url: str,
        mask_url: str,
        prompt: str,
        **kwargs,
    ) -> ToolResult:
        """Inpaint image (mock implementation)."""
        await self._simulate_delay()

        seed = int(datetime.now().timestamp() * 1000)

        return ToolResult(
            success=True,
            data={
                "image": {
                    "id": f"inpaint-{uuid.uuid4().hex[:8]}",
                    "url": f"https://picsum.photos/seed/{seed}/1024/1024",
                    "prompt": prompt,
                    "source_url": image_url,
                    "mask_url": mask_url,
                    "width": 1024,
                    "height": 1024,
                    "created_at": datetime.utcnow().isoformat(),
                    "status": "completed",
                },
                "message": "Inpainted masked region",
            },
            metadata={"mock": True},
        )


class RemoveBackgroundTool(MockTool):
    """Remove the background from an image."""

    name = "remove_background"
    description = "Remove the background from an image, making it transparent"
    parameters = {
        "type": "object",
        "properties": {
            "image_url": {
                "type": "string",
                "description": "URL of the image to process",
            },
        },
        "required": ["image_url"],
    }

    async def execute(
        self,
        image_url: str,
        **kwargs,
    ) -> ToolResult:
        """Remove background (mock implementation)."""
        await self._simulate_delay()

        seed = int(datetime.now().timestamp() * 1000)

        return ToolResult(
            success=True,
            data={
                "image": {
                    "id": f"nobg-{uuid.uuid4().hex[:8]}",
                    "url": f"https://picsum.photos/seed/{seed}/1024/1024",
                    "source_url": image_url,
                    "has_transparency": True,
                    "width": 1024,
                    "height": 1024,
                    "created_at": datetime.utcnow().isoformat(),
                    "status": "completed",
                },
                "message": "Background removed successfully",
            },
            metadata={"mock": True},
        )


class StyleTransferTool(MockTool):
    """Apply artistic style from one image to another."""

    name = "style_transfer"
    description = "Transfer the artistic style from a reference image to a content image"
    parameters = {
        "type": "object",
        "properties": {
            "content_image_url": {
                "type": "string",
                "description": "URL of the content image",
            },
            "style_image_url": {
                "type": "string",
                "description": "URL of the style reference image",
            },
            "strength": {
                "type": "number",
                "description": "Style strength (0.0-1.0)",
                "default": 0.7,
            },
        },
        "required": ["content_image_url", "style_image_url"],
    }

    async def execute(
        self,
        content_image_url: str,
        style_image_url: str,
        strength: float = 0.7,
        **kwargs,
    ) -> ToolResult:
        """Style transfer (mock implementation)."""
        await self._simulate_delay()

        seed = int(datetime.now().timestamp() * 1000)

        return ToolResult(
            success=True,
            data={
                "image": {
                    "id": f"style-{uuid.uuid4().hex[:8]}",
                    "url": f"https://picsum.photos/seed/{seed}/1024/1024",
                    "content_url": content_image_url,
                    "style_url": style_image_url,
                    "strength": strength,
                    "width": 1024,
                    "height": 1024,
                    "created_at": datetime.utcnow().isoformat(),
                    "status": "completed",
                },
                "message": f"Applied style transfer with strength {strength}",
            },
            metadata={"strength": strength, "mock": True},
        )


# Tool registry
ALL_TOOLS = {
    "generate_image": GenerateImageTool(),
    "upscale_image": UpscaleImageTool(),
    "create_variation": CreateVariationTool(),
    "remix_image": RemixImageTool(),
    "inpaint_image": InpaintImageTool(),
    "remove_background": RemoveBackgroundTool(),
    "style_transfer": StyleTransferTool(),
}


def get_all_tools() -> dict[str, MockTool]:
    """Get all available tools."""
    return ALL_TOOLS


def get_tool(name: str) -> Optional[MockTool]:
    """Get a specific tool by name."""
    return ALL_TOOLS.get(name)


def get_tool_schemas() -> list[dict]:
    """Get JSON schemas for all tools (for LLM function calling)."""
    return [tool.to_schema() for tool in ALL_TOOLS.values()]
