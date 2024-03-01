# Sistema de enquetes

![GitHub repo size](https://img.shields.io/github/repo-size/ItaloAraujodev/sistema-enquete?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/ItaloAraujodev/sistema-enquete?style=for-the-badge)

## Descrição

- Este sistema oferece uma plataforma interativa para votação em enquetes, onde os usuários têm a capacidade de criar, pesquisar e participar de enquetes de forma simples e rápida. Utilizando a tecnologia WebSocket, o sistema possibilita uma comunicação em tempo real, garantindo uma experiência fluida durante o processo de votação.

## Introdução

- O sistema de enquetes é desenvolvido utilizando ```Node.js``` e ```Fastify```, fornecendo operações CRUD para enquetes. O projeto integra o banco de dados utilizando ```Prisma```, garantindo eficiência e confiabilidade na manipulação dos dados.

## Instalando o projeto de sistema de enquetes

Para instalar o projeto, siga estas etapas:

Clone o repositório:
```
git clone git@github.com:ItaloAraujodev/sistema-enquete.git
```
Instale as dependências:
```
npm install
```
Configuração do Banco de Dados:
- O projeto utiliza o Docker Compose para configurar o banco de dados PostgreSQL. Certifique-se de ter o Docker e o Docker Compose instalados. Execute o seguinte comando para iniciar o banco de dados:
```
docker-compose up -d
```
Executar as migrations do Banco de Dados:
- O Prisma é utilizado para gerenciar as migrações do banco de dados. Execute o seguinte comando para aplicar as migrações:
```
npx prisma migrate dev
```

Iniciar o Servidor de Desenvolvimento:
- Uma vez configurado o banco de dados, inicie o servidor de desenvolvimento:

```
npm run dev
```
O servidor estará disponível em ```http://localhost:3333```.

### Rotas

| Method | URL                    | Description                                                                                            |
| ------ | -----------------------| -------------------------------------------------------------------------------------------------------|
| POST   | /polls                 | Cria uma enquete usando as informações enviadas dentro de `request.body`                               |
| POST   | /polls/:pollId/votes   | Vota em uma enquete em específico passando no `request.params` e a opção em `request.body`             |
| GET    | /polls/:pollId         | Retorna uma enquete específica                                                                         |
| ws     | /polls/:pollId/result  | Observa os votos de uma enquete específica                                                             |
