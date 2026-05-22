import {
  callCheckMd5,
  cors,
  jwtStillValid,
  pickServerJwt,
  readJsonBody,
  renewJwt,
  sendJson,
  transactionPaid,
} from './bakong-lib.mjs'

/** Run near Cambodia — can reduce Bakong HTTP 403 from distant regions */
export const config = {
  maxDuration: 15,
  regions: ['sin1', 'hkg1', 'hnd1', 'bom1'],
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' })

  const body = await readJsonBody(req)

  const md5 = String(body?.md5 || '')
    .trim()
    .toLowerCase()
  if (!md5 || !/^[a-f0-9]{32}$/.test(md5)) {
    return sendJson(res, 400, { error: 'md5 must be 32 hex characters' })
  }

  let token = pickServerJwt(body?.token || body?.bearer)

  if (!jwtStillValid(token)) {
    const email = process.env.BAKONG_EMAIL
    if (email) {
      const renewed = await renewJwt(email, process.env.BAKONG_ORG, process.env.BAKONG_PROJECT)
      if (renewed.responseCode === 0 && renewed.data?.token) {
        token = renewed.data.token
      }
    }
  }

  if (!token.startsWith('eyJ')) {
    return sendJson(res, 200, {
      responseCode: 1,
      responseMessage:
        'Missing JWT — set BAKONG_TOKEN on Vercel or ensure bakong.config.js token is sent in request',
      errorCode: 99,
      data: null,
      _dyna: { paid: false, md5, hasJwt: false },
    })
  }

  try {
    let data = await callCheckMd5(md5, token)

    if (data.errorCode === 6 && !data._bakongHttp) {
      const email = process.env.BAKONG_EMAIL
      if (email) {
        const renewed = await renewJwt(email, process.env.BAKONG_ORG, process.env.BAKONG_PROJECT)
        if (renewed.responseCode === 0 && renewed.data?.token) {
          token = renewed.data.token
          data = await callCheckMd5(md5, token)
        }
      }
    }

    const paid = transactionPaid(data) || data._dyna?.paid === true
    return sendJson(res, 200, { ...data, _dyna: { paid, md5, hasJwt: true } })
  } catch (err) {
    return sendJson(res, 502, { error: String(err.message) })
  }
}
