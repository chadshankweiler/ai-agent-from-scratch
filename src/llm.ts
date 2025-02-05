import { AIMessage } from '../types'
import { openai } from './ai'
import { zodFunction } from 'openai/helpers/zod'

export const runLLM = async ({
    messages,
    tools,
}: {
    messages: AIMessage[]
    tools: any[]
}) => {
    const formattedtools = tools.map(zodFunction)
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        store: true,
        messages,
        tools: formattedtools,
        tool_choice: 'auto',
        parallel_tool_calls: false,
    })

    return response.choices[0].message
}
