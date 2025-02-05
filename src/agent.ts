import type { AIMessage } from '../types'
import { addMessages, getMessages, saveToolResponse } from './memory'
import { runLLM } from './llm'
import { logMessage, showLoader } from './ui'
import { runTool } from './toolRunner'

export const runAgent = async ({
    userMessage,
    tools,
}: {
    userMessage: string
    tools: any[]
}) => {
    await addMessages([{ role: 'user', content: userMessage }])
    const loader = showLoader('Thinking')

    while (true) {
        // get message history
        const history = await getMessages()

        // save response when running llm
        const response = await runLLM({ messages: history, tools })

        await addMessages([response])

        // If LLM has content it'll stop
        if (response.content) {
            loader.stop()
            return getMessages()
        }


        // If LLM comes back with a Tool Call
        if (response.tool_calls) {
            const toolCall = response.tool_calls[0]

            loader.update(`executing: ${toolCall.function.name}`)

            const toolResponse = await runTool(toolCall, userMessage)
            
            // Saves into database 
            await saveToolResponse(toolCall.id, toolResponse)
            loader.update(`done: ${toolCall.function.name}`)
        }

        logMessage(response)
        loader.stop()
        return getMessages()

        // Loops again
    }
}
