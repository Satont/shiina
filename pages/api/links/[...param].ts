import { NextApiRequest, NextApiResponse } from 'next'
import { z, ZodError } from 'zod'
import { nanoid } from 'nanoid'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import prisma from '../../../lib/prisma'

const newLink = z.object({
  link: z
    .string()
    .refine((val) => ['http', 'https'].some(protocol => new URL(val).protocol !== protocol), {
      message: 'Invalid link. Link should start from http or https.',
    }),
  oneTime: z.boolean(),
  secret: z.string().optional()
})

type Body = Required<z.infer<typeof newLink>>

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const body: Body = JSON.parse(req.body)
      await newLink.parseAsync(body)

      const link = await prisma.link.create({
        data: {
          ...body,
          slug: nanoid(5)
        }
      })

      return res.json(link)
    } else {
      res.status(404).send({ error: 'Unknown request.'})
    }
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      res.status(500).json({ error: error.issues.map(i => i.message).join(', ') })
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.message.includes('Unique')) {
        res.status(400).json({ error: 'This link already exists in database' })
      } else {
        res.status(500).json({ error: error.message })
      }
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
