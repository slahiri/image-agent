"""LangGraph agent for image generation workflow using tools."""

from typing import Annotated, Any, TypedDict

from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from app.models import GeneratedImage, GenerationSettings
from app.tools import get_tool, get_all_tools, get_tool_schemas


class AgentState(TypedDict):
    """State for the image generation agent."""

    messages: Annotated[list, add_messages]
    prompt: str | None
    settings: GenerationSettings | None
    images: list[dict]
    action: str | None
    tool_name: str | None
    tool_args: dict | None
    error: str | None


async def parse_intent(state: AgentState) -> dict[str, Any]:
    """Parse user intent and determine which tool to use."""
    action = state.get("action", "generate")
    prompt = state.get("prompt", "")
    settings = state.get("settings") or GenerationSettings()

    # Map actions to tools
    tool_mapping = {
        "generate": "generate_image",
        "upscale": "upscale_image",
        "variation": "create_variation",
        "remix": "remix_image",
        "inpaint": "inpaint_image",
        "remove_bg": "remove_background",
        "style_transfer": "style_transfer",
    }

    tool_name = tool_mapping.get(action, "generate_image")

    # Build tool arguments based on action
    tool_args = {"prompt": prompt}

    if action == "generate":
        tool_args = {
            "prompt": prompt,
            "num_images": settings.number_of_images,
            "width": settings.width,
            "height": settings.height,
            "model": settings.model,
            "negative_prompt": settings.negative_prompt,
        }
    elif action in ["upscale", "variation", "remix"]:
        # These need an image_url from the state
        images = state.get("images", [])
        if images:
            tool_args["image_url"] = images[0].get("url", "")
        tool_args["prompt"] = prompt

    return {
        "tool_name": tool_name,
        "tool_args": tool_args,
    }


async def execute_tool(state: AgentState) -> dict[str, Any]:
    """Execute the selected tool."""
    tool_name = state.get("tool_name")
    tool_args = state.get("tool_args", {})

    if not tool_name:
        return {"error": "No tool selected", "action": "error"}

    tool = get_tool(tool_name)
    if not tool:
        return {"error": f"Tool '{tool_name}' not found", "action": "error"}

    try:
        result = await tool.execute(**tool_args)

        if not result.success:
            return {"error": result.error, "action": "error"}

        # Extract images from result
        images = []
        if result.data:
            if "images" in result.data:
                images = result.data["images"]
            elif "image" in result.data:
                images = [result.data["image"]]

        return {
            "images": images,
            "action": "complete",
        }
    except Exception as e:
        return {
            "error": str(e),
            "action": "error",
        }


def route_to_end(state: AgentState) -> str:
    """Route to end after tool execution."""
    return END


def create_image_agent() -> StateGraph:
    """Create the LangGraph workflow for image generation."""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("parse_intent", parse_intent)
    workflow.add_node("execute_tool", execute_tool)

    # Set entry point
    workflow.set_entry_point("parse_intent")

    # Add edges
    workflow.add_edge("parse_intent", "execute_tool")
    workflow.add_edge("execute_tool", END)

    return workflow.compile()


# Create the agent instance
image_agent = create_image_agent()


# Export tool schemas for LLM integration
def get_available_tools() -> list[dict]:
    """Get available tools with their schemas."""
    return get_tool_schemas()
