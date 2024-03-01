import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {

  app.get('/polls/:pollId', async (req: FastifyRequest, reply: FastifyReply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = getPollParams.parse(req.params)


    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!poll) {
      return reply.status(404).send({ error: "Poll not found" })
    }

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES") // Retorna um array com os ids das opções e a quantidade de votos

    const votes = result.reduce((obj, line, index) => {
      if(index % 2 === 0){
        const score = result[index + 1]

        Object.assign(obj, { [line]: parseInt(score) })
      }
      return obj
    }, {} as Record<string, number>)

    return reply.status(200).send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => {
          return {
            id: option.id,
            title: option.title,
            votes: votes[option.id] || 0
          }
        }),
      }
    });
  })
} 