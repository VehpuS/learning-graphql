import { GraphQLServer } from 'graphql-yoga'

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length

const findLink = (id) => links.find(link => link.id === id)

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, { id }) => findLink(id)
    },
    // because the implementation of the Link resolvers is trivial, you can actually omit them and the server will work in the same way as it did before
    // Link: {
    //     id: (root) => root.id,
    //     description: (root) => root.description,
    //     url: (root) => root.url,
    // }
    Mutation: {
        post: (root, { description, url}) => {
            const link = {
                id: `link-${idCount++}`,
                description,
                url,
            }
            links.push(link)
            return link
        },
        updateLink: (root, {id, url, description}) => {
            links = links.map((link) =>
                (link.id === id) ? 
                    {
                        ...link,
                        url: url || link.url,
                        description: description || link.description
                    } :
                    link)
            return findLink(id)
        },
        deleteLink: (root, {id}) => {
            const deletedLink = findLink(id)
            links = links.filter(link =>
                (link.id !== id))
            return deletedLink
        },
    },

}

const server = new GraphQLServer({
    /*
     * One convenient thing about the constructor of the GraphQLServer is that
     * typeDefs can be provided either directly as a string (as you previously
     * did) or by referencing a file that contains your schema definition
     * (this is what you’re doing now).
     */
    typeDefs: './src/schema.graphql',
    resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
