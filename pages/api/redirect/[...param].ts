import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    return res.redirect(`/error?message=Link with id ${id} not found in database.`)
  }

  if (link.secret && secret !== link.secret) {
    return res.redirect(`/error?message=Your secret is wrong for that link.`)
  }

  if (link.oneTime && await prisma.linksUsage.count({ where: { linkId: link.id }})) {
    return res.redirect(`/error?message=This link is one time and already used.`)
  }

  res.redirect(link.link)
  res.status(200).json(link)
  await prisma.linksUsage.create({ 
    data: {
      linkId: link.id,
    }
  })
}