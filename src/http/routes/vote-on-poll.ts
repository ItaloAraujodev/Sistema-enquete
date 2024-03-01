import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { randomUUID } from "node:crypto"
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";

export async function voteOnPoll(app: FastifyInstance) {

  app.post('/polls/:pollId/votes', async (req: FastifyRequest, reply: FastifyReply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = voteOnPollParams.parse(req.params)
    const { pollOptionId } = voteOnPollBody.parse(req.body)


    // Se não existir um sessionId, cria um novo
    // Se não fizer essa verificação, o usuário vai criar varios cookies e poderá votar várias vezes
    let { sessionId } = req.cookies

    if(sessionId){
      const userPreviousVotes = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      if(userPreviousVotes && userPreviousVotes.pollOptionId !== pollOptionId){
        await prisma.vote.delete({
          where: {
            id: userPreviousVotes.id
          }
        })
        const votes = await redis.zincrby(pollId, -1, userPreviousVotes.pollOptionId)

        voting.publish(pollId, 
          { 
            pollOptionId: userPreviousVotes.pollOptionId, 
            votes: Number(votes) 
          })

      } else if (userPreviousVotes){
        return reply.status(400).send({error: "User already voted"})
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie("sessionId", sessionId, {
        path: "/", // Quais rotas da aplicação terão acesso ao cookie
        maxAge: 60 * 60 * 24 * 7, // 7 dias - Tempo de vida do cookie
        signed: true, // Assinatura do cookie - Evita que o cookie seja alterado
        httpOnly: true, // O cookie só pode ser acessado pelo servidor
      })
    }

    await prisma.vote.create({
      data: {
        pollOptionId,
        sessionId,
        pollId
      }
    })

    const votes = await redis.zincrby(pollId, 1, pollOptionId) // Incrementa o valor (1) do pollOptionId no pollId

    voting.publish(pollId, { pollOptionId, votes: Number(votes) })

    return reply.status(201).send();
  })
} 