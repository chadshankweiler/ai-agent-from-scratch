import type OpenAI from 'openai'
import { generateImage, generateImageToolDefinition } from '../tools/generateImage'
import { reddit, redditToolDefinition } from '../tools/reddit'
import { dadJokes, dadJokeToolDefinition } from '../tools/dadJokes'

export const runTool = async (
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    userMessage: string
) => {
    const input = {
        userMessage,
        toolArgs: JSON.parse(toolCall.function.arguments)
    }

    switch (toolCall.function.name) {
        case generateImageToolDefinition.name: 
            return generateImage(input)
        case redditToolDefinition.name: 
            return reddit(input)
        case dadJokeToolDefinition.name: 
            return dadJokes(input)
        default: 
            return `Never run this ${toolCall.function.name} or else`
    }
   
}
