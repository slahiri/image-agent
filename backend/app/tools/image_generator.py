"""Image generation tools for the LangGraph agent."""

import uuid
from datetime import datetime
from typing import Optional

import httpx

from app.models import GeneratedImage, GenerationSettings, ImageStatus


class ImageGenerator:
    """Base class for image generation."""

    async def generate(
        self,
        prompt: str,
        settings: GenerationSettings,
    ) -> list[GeneratedImage]:
        """Generate images from a prompt."""
        raise NotImplementedError


class MockImageGenerator(ImageGenerator):
    """Mock image generator for development and testing."""

    async def generate(
        self,
        prompt: str,
        settings: GenerationSettings,
    ) -> list[GeneratedImage]:
        """Generate mock images using placeholder service."""
        images = []
        for i in range(settings.number_of_images):
            seed = settings.seed or int(datetime.now().timestamp() * 1000) + i
            image = GeneratedImage(
                id=f"img-{uuid.uuid4().hex[:8]}",
                url=f"https://picsum.photos/seed/{seed}/{settings.width}/{settings.height}",
                prompt=prompt,
                negative_prompt=settings.negative_prompt,
                width=settings.width,
                height=settings.height,
                seed=seed,
                model=settings.model,
                created_at=datetime.utcnow(),
                status=ImageStatus.COMPLETED,
            )
            images.append(image)
        return images


class OpenAIImageGenerator(ImageGenerator):
    """Generate images using OpenAI DALL-E."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.openai.com/v1/images/generations"

    async def generate(
        self,
        prompt: str,
        settings: GenerationSettings,
    ) -> list[GeneratedImage]:
        """Generate images using DALL-E 3."""
        images = []

        async with httpx.AsyncClient() as client:
            for i in range(settings.number_of_images):
                try:
                    response = await client.post(
                        self.base_url,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": "dall-e-3",
                            "prompt": prompt,
                            "n": 1,
                            "size": f"{settings.width}x{settings.height}",
                            "quality": "standard",
                        },
                        timeout=60.0,
                    )
                    response.raise_for_status()
                    data = response.json()

                    if data.get("data"):
                        url = data["data"][0]["url"]
                        image = GeneratedImage(
                            id=f"dalle-{uuid.uuid4().hex[:8]}",
                            url=url,
                            prompt=prompt,
                            width=settings.width,
                            height=settings.height,
                            model="dall-e-3",
                            created_at=datetime.utcnow(),
                            status=ImageStatus.COMPLETED,
                        )
                        images.append(image)
                except Exception as e:
                    print(f"DALL-E generation error: {e}")
                    # Add a failed image placeholder
                    images.append(
                        GeneratedImage(
                            id=f"dalle-failed-{uuid.uuid4().hex[:8]}",
                            url="",
                            prompt=prompt,
                            width=settings.width,
                            height=settings.height,
                            model="dall-e-3",
                            created_at=datetime.utcnow(),
                            status=ImageStatus.FAILED,
                        )
                    )

        return images


class StabilityImageGenerator(ImageGenerator):
    """Generate images using Stability AI."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.stability.ai/v1/generation"

    async def generate(
        self,
        prompt: str,
        settings: GenerationSettings,
    ) -> list[GeneratedImage]:
        """Generate images using Stable Diffusion."""
        # Implementation for Stability AI would go here
        # For now, fall back to mock
        mock_gen = MockImageGenerator()
        return await mock_gen.generate(prompt, settings)


def get_image_generator(
    model: str,
    openai_api_key: Optional[str] = None,
    stability_api_key: Optional[str] = None,
) -> ImageGenerator:
    """Factory function to get the appropriate image generator."""
    if model in ["dall-e-3", "dalle-3"] and openai_api_key:
        return OpenAIImageGenerator(openai_api_key)
    elif model in ["stable-diffusion-xl", "sdxl"] and stability_api_key:
        return StabilityImageGenerator(stability_api_key)
    else:
        # Default to mock generator
        return MockImageGenerator()
