# Sistema de enquetes

![GitHub repo size](https://img.shields.io/github/repo-size/ItaloAraujodev/sistema-enquete?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/ItaloAraujodev/sistema-enquete?style=for-the-badge)

## Descrição

- Este sistema oferece uma plataforma interativa para votação em enquetes, onde os usuários têm a capacidade de criar, pesquisar e participar de enquetes de forma simples e rápida. Utilizando a tecnologia WebSocket, o sistema possibilita uma comunicação em tempo real, garantindo uma experiência fluida durante o processo de votação.



## 🚀 Instalando o projeto de sistema de enquetes

Para instalar, siga estas etapas:

```
npm install

docker-compose up -d

npx prisma migrate dev

npm run dev

```

### Rotas

| Method | URL                    | Description                                                                                            |
| ------ | -----------------------| -------------------------------------------------------------------------------------------------------|
| POST   | /polls                 | Cria uma enquete usando as informações enviadas dentro de `request.body`                               |
| POST   | /polls/:pollId/votes   | Vota em uma enquete em específico passando no `request.params` e a opção em `request.body`             |
| GET    | /polls/:pollId         | Retorna uma enquete específica                                                                         |
| ws     | /polls/:pollId/result  | Fica observando os votos de uma enquete em específico                                                  |
