const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.db.mutation.createUser({
        data: { ...args, password },
    }, `{ id }`)

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const loginErr = new Error("Incorrect user or password")

    const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
    if (!user) {
        throw loginErr
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw loginErr
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

const post = (parent, args, context, info) => 
    context.db.mutation.createLink(
        {
            data: {
                url: args.url,
                description: args.description,
                postedBy: { connect: { id: getUserId(context) } },
            },
        },
        info,
    )

// updateLink: (root, { id, url, description }) => {
//     links = links.map((link) =>
//         (link.id === id) ?
//             {
//                 ...link,
//                 url: url || link.url,
//                 description: description || link.description
//             } :
//             link)
//     return findLink(id)
// },
// deleteLink: (root, { id }) => {
//     const deletedLink = findLink(id)
//     links = links.filter(link =>
//         (link.id !== id))
//     return deletedLink
// },

const Mutation = {
    signup,
    login,
    post,
}

export default Mutation
