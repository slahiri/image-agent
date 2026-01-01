"""LangGraph agent for image generation workflow."""

from typing import Annotated, Any, TypedDict

from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from app.config import settings
from app.models import GeneratedImage, GenerationSettings
from app.tools import get_image_generator


class AgentState(TypedDict):
    """State for the image generation agent."""

    messages: Annotated[list, add_messages]
    prompt: str | None
    settings: GenerationSettings | None
    images: list[GeneratedImage]
    action: str | None
    error: str | None


async def parse_prompt(state: AgentState) -> dict[str, Any]:
    """Parse and enhance the user prompt."""
    prompt = state.get("prompt", "")

    # Here you could add LLM-based prompt enhancement
    # For now, we just pass through the prompt
    enhanced_prompt = prompt

    return {
        "prompt": enhanced_prompt,
        "action": "generate",
    }


async def generate_images(state: AgentState) -> dict[str, Any]:
    """Generate images using the configured generator."""
    prompt = state.get("prompt", "")
    gen_settings = state.get("settings") or GenerationSettings()

    try:
        # Get the appropriate generator
        generator = get_image_generator(
            model=gen_settings.model,
            openai_api_key=settings.openai_api_key,
            stability_api_key=settings.stability_api_key,
        )

        # Generate images
        images = await generator.generate(prompt, gen_settings)

        return {
            "images": images,
            "action": "complete",
        }
    except Exception as e:
        return {
            "error": str(e),
            "action": "error",
        }


async def upscale_image(state: AgentState) -> dict[str, Any]:
    """Upscale an image to higher resolution."""
    # For now, return mock upscaled image
    # In production, integrate with an upscaling service like Real-ESRGAN
    images = state.get("images", [])

    if images:
        original = images[0]
        upscaled = GeneratedImage(
            id=f"upscale-{original.id}",
            url=original.url,  # Would be replaced with actual upscaled URL
            prompt=original.prompt,
            width=original.width * 2,
            height=original.height * 2,
            model="upscaler",
            status="completed",
        )
        return {"images": [upscaled], "action": "complete"}

    return {"error": "No image to upscale", "action": "error"}


async def create_variation(state: AgentState) -> dict[str, Any]:
    """Create variations of an image."""
    prompt = state.get("prompt", "")
    gen_settings = state.get("settings") or GenerationSettings()

    try:
        generator = get_image_generator(
            model=gen_settings.model,
            openai_api_key=settings.openai_api_key,
            stability_api_key=settings.stability_api_key,
        )

        # Generate variations with slightly modified prompt
        images = await generator.generate(prompt, gen_settings)

        return {
            "images": images,
            "action": "complete",
        }
    except Exception as e:
        return {
            "error": str(e),
            "action": "error",
        }


def route_action(state: AgentState) -> str:
    """Route to the appropriate action based on state."""
    action = state.get("action", "generate")

    if action == "upscale":
        return "upscale"
    elif action == "variation":
        return "variation"
    elif action == "complete":
        return END
    elif action == "error":
        return END
    else:
        return "generate"


def create_image_agent() -> StateGraph:
    """Create the LangGraph workflow for image generation."""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("parse", parse_prompt)
    workflow.add_node("generate", generate_images)
    workflow.add_node("upscale", upscale_image)
    workflow.add_node("variation", create_variation)

    # Set entry point
    workflow.set_entry_point("parse")

    # Add edges
    workflow.add_conditional_edges(
        "parse",
        route_action,
        {
            "generate": "generate",
            "upscale": "upscale",
            "variation": "variation",
            END: END,
        },
    )

    workflow.add_edge("generate", END)
    workflow.add_edge("upscale", END)
    workflow.add_edge("variation", END)

    return workflow.compile()


# Create the agent instance
image_agent = create_image_agent()
