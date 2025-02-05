import { dadJokeToolDefinition } from "./dadJokes";
import { generateImageToolDefinition } from "./generateImage";
import { redditToolDefinition } from "./reddit";

export const tools = [generateImageToolDefinition, redditToolDefinition, dadJokeToolDefinition]
