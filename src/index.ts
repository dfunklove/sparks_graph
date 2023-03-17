const { ApolloServer } = require('apollo-server')
const { schema } = require('./schema')

const port = process.env.PORT || 9090;

const server = new ApolloServer({ schema });

server.listen({ port }, () => console.log(`Server runs at: http://localhost:${port}`));