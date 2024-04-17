export const checkCast = async (castHash: string, fid: number) => {
    try {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', api_key: process.env.NEYNAR_API_KEY || '' }
        };

        const url = `https://api.neynar.com/v2/farcaster/casts?casts=${castHash}&viewer_fid=${fid}`

        const response = await fetch(url, options)
            .then(response => response.json())

        return response.casts?.[0].viewer_context
    } catch (error) {
        console.error(error)
    }
}