import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { checkFollower } from '../utils/checkFollower.js'
import { checkCast } from '../utils/checkCast.js'
import { neynar } from 'frog/hubs'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || '' })
})

const imageMap: Record<string, string> = {
  "state:eval": 'success.png',
  "state:intro": 'intro.png',
  "state:retry": 'error.png',
}

app.frame('/', async (c) => {
  const origin = c.url.split('/api')[0]
  const { buttonValue } = c

  let state = buttonValue || "state:intro"

  const fid = c.frameData?.fid
  const castHash = c.frameData?.castId.hash

  const isFollower = fid && await checkFollower(fid)
  const castDetails = fid && castHash && await checkCast(castHash, fid)

  const isValid = isFollower.following && castDetails?.liked && castDetails?.recasted

  if (!isValid && state === "state:eval") {
    state = "state:retry"
  }

  return c.res({
    image: origin + '/images/' + imageMap[state],
    intents: [
      state === 'state:intro' && <Button value={"state:eval"}>Know more</Button>,
      state === 'state:eval' && <Button.Link href="https://0xfbi.com/based-fellowship">Tell me more</Button.Link>,
      state === 'state:retry' && <Button value={'state:eval'}>Retry</Button>,
    ],
  })
})

app.frame('/error', (c) => {
  console.log(c)
  // const { buttonValue, inputText, status } = c
  // const fruit = inputText || buttonValue
  return c.res({
    image: 'http://localhost:5174/images/error.png',
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
