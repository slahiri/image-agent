from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ImageStatus(str, Enum):
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class GenerationSettings(BaseModel):
    model: str = "stable-diffusion-xl"
    width: int = 1024
    height: int = 1024
    steps: Optional[int] = 30
    guidance: Optional[float] = 7.5
    negative_prompt: Optional[str] = None
    seed: Optional[int] = None
    number_of_images: int = Field(default=4, alias="numberOfImages")

    class Config:
        populate_by_name = True


class GeneratedImage(BaseModel):
    id: str
    url: str
    prompt: str
    negative_prompt: Optional[str] = None
    width: int
    height: int
    seed: Optional[int] = None
    model: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: ImageStatus = ImageStatus.COMPLETED

    class Config:
        populate_by_name = True


class GenerateRequest(BaseModel):
    prompt: str
    settings: Optional[GenerationSettings] = None
    session_id: Optional[str] = None


class GenerateResponse(BaseModel):
    message: str
    images: list[GeneratedImage]


class UpscaleRequest(BaseModel):
    image_id: str
    image_url: str


class UpscaleResponse(BaseModel):
    message: str
    image: GeneratedImage


class VariationRequest(BaseModel):
    image_id: str
    image_url: str
    prompt: str


class VariationResponse(BaseModel):
    message: str
    images: list[GeneratedImage]


class RemixRequest(BaseModel):
    image_id: str
    image_url: str
    prompt: str


class RemixResponse(BaseModel):
    message: str
    images: list[GeneratedImage]


class AgentState(BaseModel):
    """State for the LangGraph agent."""

    messages: list = Field(default_factory=list)
    prompt: Optional[str] = None
    settings: Optional[GenerationSettings] = None
    images: list[GeneratedImage] = Field(default_factory=list)
    current_action: Optional[str] = None
    error: Optional[str] = None
