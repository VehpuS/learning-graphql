import { GraphQLServer } from 'graphql-yoga'

import Query from "../../../server/src/resolvers/Query"
import Mutation from "../../../server/src/resolvers/Mutation"
import Subscription from "../../../server/src/resolvers/Subscription"
import AuthPayload from "../../../server/src/resolvers/AuthPayload"
import Feed from "../../../server/src/resolvers/Feed"

const resolvers = {
    Query,
    Mutation,
    Subscription,
    AuthPayload,
    Feed,
}

test('resolvers are sucessfully loaded to GraphQL server', () => {
    expect(() => new GraphQLServer({
        /*
         * One convenient thing about the constructor of the GraphQLServer is that
         * typeDefs can be provided either directly as a string (as you previously
         * did) or by referencing a file that contains your schema definition
         * (this is what you’re doing now).
         */
        typeDefs: '../server/src/schema.graphql',
        resolvers,
        resolverValidationOptions: {
            // TODO: check why this is necessary to get no warnings
            // Start from https://github.com/prismagraphql/prisma/issues/2225
            requireResolversForResolveType: false,
        },
    })).not.toThrow()
})

test('can run on empty db responses', async () => {
    const parent = {}
    const args = {}
    const context = {
        db: {
            query: {
                links: () => ([]),
                linksConnection: () => ({
                    aggregate: {
                        count: 0
                    }
                })
            }
        }
    }
    const info = {}
    const emptyFeed = await Query.feed(parent, args, context, info)
    expect(emptyFeed).toEqual({
        count: 0,
        linkIds: []
    })
})

test('can extract ids from links', async () => {
    const parent = {}
    const args = {}
    const context = {
        db: {
            query: {
                links: () => ([
                    { url: 'www.test1.com', id: 1 },
                    { url: 'www.test2.com', id: 2 },
                ]),
                linksConnection: () => ({
                    aggregate: {
                        count: 2
                    }
                })
            }
        }
    }
    const info = {}
    const emptyFeed = await Query.feed(parent, args, context, info)
    expect(emptyFeed).toEqual({
        count: 2,
        linkIds: [1, 2]
    })
})