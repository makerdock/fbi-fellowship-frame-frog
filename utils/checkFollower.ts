
const SAXENASAHEB_FID = 4753

export const checkFollower = async (fid: number) => {
    try {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' }
        };

        const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${SAXENASAHEB_FID}&viewer_fid=${fid}`

        const response = await fetch(url, options)
            .then(response => response.json())

        return response.users[0].viewer_context
    } catch (error) {
        console.error(error)
    }
}