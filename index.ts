import 'dotenv/config'
import { runLLM } from './src/llm'
import { addMessages, getMessages } from './src/memory'
import { z } from 'zod'
import { runAgent } from './src/agent'
import { tools } from './tools'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message')
    process.exit(1)
}

await addMessages([{ role: 'user', content: userMessage }])
const messages = await getMessages()

const response = await runAgent({userMessage, tools})

console.log(response)
