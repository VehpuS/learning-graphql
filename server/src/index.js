import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'
import helmet from 'helmet';
import compression from 'compression';
import RateLimit from 'express-rate-limit';

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import AuthPayload from './resolvers/AuthPayload'
import Feed from './resolvers/Feed'
import Subscription from './resolvers/Subscription'
import config from "./config/config"
import rateLimitConfig from './config/rateLimiter';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    AuthPayload,
    Feed,
}

const prismaConfig = config.get("prisma")
const appEnv = config.get('env')

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
            ...prismaConfig,
            debug: appEnv !== 'production',
        }),
    }),
})

server.express.use(helmet());
server.express.use(compression());

// Basic rate-limiting middleware
server.express.enable('trust proxy');
server.express.use(new RateLimit(rateLimitConfig));

server.start(() => console.log(`Server is running on http://localhost:4000`))
