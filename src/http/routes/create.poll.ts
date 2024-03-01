import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function createPoll(app: FastifyInstance){
  
app.post('/polls', async (req: FastifyRequest, reply: FastifyReply) => {
  const createPollBodySchema = z.object({
    title: z.string(),
    options: z.array(z.string())
  })
  const { title, options } = createPollBodySchema.parse(req.body)


  const poll =  await prisma.poll.create({
    data: {
      title,
      options: {
        createMany: {
          data: options.map((option: string) => {
            return { title: option }
          })
        }
      }
    }
  })

  return reply.status(201).send(poll);
})

} 