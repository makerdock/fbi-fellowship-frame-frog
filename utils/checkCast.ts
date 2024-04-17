export const checkCast = async (castHash: string, fid: number) => {
    try {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', api_key: process.env.NEYNAR_API_KEY || '' }
        };

        const url = `https://api.neynar.com/v2/farcaster/casts?casts=${castHash}&viewer_fid=${fid}`

        const response: CastResult = await fetch(url, options)
            .then(response => response.json())
        console.log("🚀 ~ checkCast ~ response:", JSON.stringify(response))

        return response.result?.casts?.[0].viewer_context
    } catch (error) {
        console.error(error)
    }
}

export interface CastResult {
    result: Result
}

export interface Result {
    casts: Cast[]
}

export interface Cast {
    object: string
    hash: string
    thread_hash: string
    parent_hash: any
    parent_url: any
    root_parent_url: any
    parent_author: ParentAuthor
    author: Author
    text: string
    timestamp: string
    embeds: Embed[]
    reactions: Reactions
    replies: Replies
    mentioned_profiles: any[]
    viewer_context: ViewerContext
}

export interface ParentAuthor {
    fid: any
}

export interface Author {
    object: string
    fid: number
    custody_address: string
    username: string
    display_name: string
    pfp_url: string
    profile: Profile
    follower_count: number
    following_count: number
    verifications: string[]
    verified_addresses: VerifiedAddresses
    active_status: string
    power_badge: boolean
}

export interface Profile {
    bio: Bio
}

export interface Bio {
    text: string
    mentioned_profiles: any[]
}

export interface VerifiedAddresses {
    eth_addresses: string[]
    sol_addresses: any[]
}

export interface Embed {
    url: string
}

export interface Reactions {
    likes: Like[]
    recasts: Recast[]
}

export interface Like {
    fid: number
    fname: string
}

export interface Recast {
    fid: number
    fname: string
}

export interface Replies {
    count: number
}

export interface ViewerContext {
    liked: boolean
    recasted: boolean
}
