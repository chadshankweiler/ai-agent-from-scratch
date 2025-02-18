import { z } from 'zod'
import type { ToolFn } from '../types'
import fetch from 'node-fetch'

export const redditToolDefinition = {
    name: 'reddit',
    parameters: z.object({}),
    description: 'get the front page of reddit',
}

type Args = z.infer<typeof redditToolDefinition.parameters>

export const reddit: ToolFn<Args, string> = async ({ toolArg }) => {
    const { data } = await fetch('https://www.reddit.com/r/nba/.json').then(
        (res) => res.json()
    )

    const relevantInfo = data.children.map((child: any) => ({
        title: child.data.title,
        link: child.data.link,
        subreddit: child.data.subreddit_name_prefix,
        author: child.data.author,
        upvotes: child.data.ups,
    }))

    return JSON.stringify(relevantInfo, null, 2)
}
