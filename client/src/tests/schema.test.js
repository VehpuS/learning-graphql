import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import { importSchema } from 'graphql-import'

describe('schema tests', async () => {
    const schemaPath = '../server/src/schema.graphql'
    const typeDefs = importSchema(schemaPath)

    const schema = makeExecutableSchema({
        typeDefs,
        resolverValidationOptions: {
            // TODO: check why this is necessary to get no warnings
            // Start from https://github.com/prismagraphql/prisma/issues/2225
            requireResolversForResolveType: false,
        },
    });

    const mocks = {
        DateTime: () => new Date(0),
    }
    // Add mocks, modifies schema in place
    addMockFunctionsToSchema({ schema, mocks })

    test('feed querying', async () => {
        const query = `
{
    feed {
        links {
            createdAt
            id
            url
            description
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
}`

        const { data, errors } = await graphql(schema, query)

        expect(errors).toBeUndefined()
        expect(data).toBeTruthy()
        expect(data).toHaveProperty("feed.links")
        data.feed.links.forEach(link => {
            expect(link).toHaveProperty("createdAt")
            expect(link).toHaveProperty("id")
            expect(link).toHaveProperty("url")
            expect(link).toHaveProperty("description")
            expect(link).toHaveProperty("postedBy.id")
            expect(link).toHaveProperty("postedBy.name")
            expect(link).toHaveProperty("votes")
            link.votes.forEach(vote => {
                expect(vote).toHaveProperty("id")
                expect(vote).toHaveProperty("user.id")
            })
        })
    })
})
