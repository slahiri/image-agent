from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    # LLM Settings
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    default_llm: str = "openai"  # "openai" or "anthropic"

    # Image Generation Settings
    replicate_api_key: Optional[str] = None
    stability_api_key: Optional[str] = None
    openai_dalle_enabled: bool = True

    # Storage
    upload_dir: str = "./uploads"
    generated_dir: str = "./generated"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
