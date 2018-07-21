import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import AuthPayload from './resolvers/AuthPayload'


const findLink = (id) => links.find(link => link.id === id)

const resolvers = {
    Query,
    Mutation,
    AuthPayload,
}

const server = new GraphQLServer({
    /*
     * One convenient thing about the constructor of the GraphQLServer is that
     * typeDefs can be provided either directly as a string (as you previously
     * did) or by referencing a file that contains your schema definition
     * (this is what you’re doing now).
     */
    typeDefs: 'src/schema.graphql',
    resolvers,
    resolverValidationOptions: {
        // TODO: check why this is necessary to get no warnings
        // Start from https://github.com/prismagraphql/prisma/issues/2225
        requireResolversForResolveType: false,
    },
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'http://localhost:4466/',
            secret: 'mysecret123',
            debug: true,
        }),
    }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
