// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json({
    "todos": [{"id":1,"body":"todo 1","isCompleted":false}, 
        {"id":2,"body":"todo 2","isCompleted":true}
    ],
    "filterChange": "ALL"
})
}
