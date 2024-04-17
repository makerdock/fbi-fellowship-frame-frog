import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
  const origin = c.url.split('/api')[0]
  const { buttonValue } = c
  console.log("🚀 ~ app.frame ~ buttonValue:", buttonValue)

  const state = buttonValue || "state:intro"

  return c.res({
    image: origin + '/images/intro.png',
    intents: [
      state === 'state:intro' && <Button value={"state:eval"}>Know more</Button>,
      state === 'state:eval' && <Button value={"state:eval"}>Retry</Button>,
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
