"""Base tool interface for image generation and modification."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class ToolResult(BaseModel):
    """Result from a tool execution."""

    success: bool
    data: Optional[dict[str, Any]] = None
    error: Optional[str] = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class Tool(ABC):
    """Base class for all tools."""

    name: str
    description: str
    parameters: dict[str, Any]

    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with given parameters."""
        pass

    def to_schema(self) -> dict[str, Any]:
        """Convert tool to JSON schema for LLM function calling."""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters,
        }


class MockTool(Tool):
    """Base class for mocked tools - returns simulated responses."""

    mock_delay: float = 0.5  # Simulated delay in seconds

    async def _simulate_delay(self):
        """Simulate API latency."""
        import asyncio
        await asyncio.sleep(self.mock_delay)
