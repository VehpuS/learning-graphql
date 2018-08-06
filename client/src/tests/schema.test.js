import { GraphQLServer } from 'graphql-yoga'

const schemaPath = '../server/src/schema.graphql'

test('schema loads with apollo', () =>
    expect(() => new GraphQLServer({
            typeDefs: schemaPath,
            resolverValidationOptions: {
                requireResolversForResolveType: false,
            },
        })).not.toThrow())
