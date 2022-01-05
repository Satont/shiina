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
    } else if (req.method === 'GET') {
      /* const prisma = await createPrisma() */
      const [id, secret] = req.query.param as string[]

      if (!id) {
        return res.status(400).json({ error: 'You are using api wrong.' })
      }

      const link = await prisma.link.findFirst({
        where: {
          slug: id,
        }
      })

      if (!link) {
        return res.status(404).json({ error: `Link with id ${id} not found in database.`})
      }

      if (link.secret && secret !== link.secret) {
        return res.status(401).json({ error: `Your secret is wrong for that link.` })
      }

      console.log(link, await prisma.linksUsage.count({ where: { linkId: link.id }}))

      if (link.oneTime && await prisma.linksUsage.count({ where: { linkId: link.id }})) {
        return res.status(401).json({ error: 'This link already used.' })
      }
  
      res.status(200).json(link)
      await prisma.linksUsage.create({ 
        data: {
          linkId: link.id,
        }
      })
    } else {
      res.status(404).send({ error: 'Unknown request.'})
    }
  } catch (error) {

    if (error instanceof ZodError) {
      res.status(500).json({ error: error.issues.map(i => i.message).join(', ') })
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.message.includes('Unique')) {
        res.status(400).json({ error: 'This link already exists in database' })
      }
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}
