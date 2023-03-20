const { ApolloServer } = require('apollo-server')
const { schema } = require('./schema')

const port = process.env.PORT || 5003;

const server = new ApolloServer({ schema });

server.listen({ port }, () => console.log(`Server runs at: http://localhost:${port}`));
