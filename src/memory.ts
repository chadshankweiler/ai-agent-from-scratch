import { JSONFilePreset } from 'lowdb/node'
import type { AIMessage } from '../types'
import { v4 as uuidv4 } from 'uuid'

// Extend Message Type with ID and CreatedAt
export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
}

// adding Metadata to the message to be stored in database
export const addMetadata = (message: AIMessage): MessageWithMetadata => ({
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
})

// remove metadata so data can be sent to openai without issues
export const removeMetadata = (message: MessageWithMetadata): AIMessage => {
    const { id, createdAt, ...rest } = message
    return rest
}

type Data = {
    messages: MessageWithMetadata[]
}

const defaultData: Data = { messages: [] }

export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defaultData)

    return db
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb();

    // Map to add metadata to each message
    db.data.messages.push(...messages.map(addMetadata));
    await db.write()
}

export const getMessages = async () => {
    const db = await getDb();

    // Map to remove metadata
    return db.data.messages.map(removeMetadata);
}

export const saveToolResponse = async (
    toolCallId: string,
    toolResponse: string,
) => {
    return addMessages([
        {
            role: "tool",
            content: toolResponse,
            tool_call_id: toolCallId,
        },
    ])
}
