import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
    APP_SECRET,
    getUserId,
    getUserByEmail
} from '../utils'


const getUserInfoFromFacebook = async (facebookToken) => {
    const response = await fetch(`https://graph.facebook.com/v2.9/me?fields=id%2Cemail&access_token=${facebookToken}`)
    const parsedResponse = response.json()
    if (parsedResponse.error) {
        return Promise.reject(parsedResponse.error.message)
    } else {
        return parsedResponse
    }
}

const getUserInfoFromGoogle = async (googleToken) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`)
    const parsedResponse = await response.json()
    if (parsedResponse.error_description) {
        return Promise.reject(parsedResponse.error_description)
    } else {
        return {
            id: parsedResponse.sub,
            email: parsedResponse.email
        }
    }
}

const getSocialProviderInfoByToken = async (provider, token) => {
    let getInfoByToken

    switch (provider) {
        case 'facebook':
            getInfoByToken = getUserInfoFromFacebook
            break
        case 'google':
            getInfoByToken = getUserInfoFromGoogle
            break
        default:
            throw new Error(`Unknown provider ${provider}`)
    }

    const userInfo = await getInfoByToken(token)
    return userInfo
}

const signupPassword = async (parent, args, context, info) => {
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

const signupSocialProvider = async (parent, args, context, info) => {
    const { provider, providerToken } = args
    const userInfo = await getSocialProviderInfoByToken(provider, providerToken)
    console.log("GOOGLE USER RESPONSE", userInfo)
    const {id, email} = userInfo
    if (!id || !email) {
        throw new Error(`Failed to confirm user from ${provider}`)
    }

    let user = await context.db.mutation.upsertUser({
        where: { email },
        create: { email, [provider]: { create: { socialID: id } } },
        update: { [provider]: { create: { socialID: id } } },
    }, `{ id }`)

    user = await context.db.mutation.updateUser({
        where: { id: user.id },
        data: { [provider]: { create: { socialID: id } } },
    })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

const loginPassword = async (parent, args, context, info) => {
    const loginErr = new Error("Incorrect user or password")

    const user = await getUserByEmail(context.db, args.email, ` { id password } `, loginErr)

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

const loginSocialProvider = async (parent, args, context, info) => {
    const { provider, providerToken } = args
    const loginErr = new Error(`Failed to login user using ${provider}. Make sure your account is linked to this service.`)
    const userInfo = await getSocialProviderInfoByToken(provider, providerToken)
    const user = await getUserByEmail(
        context.db,
        userInfo.email,
        `
        {
            id
            name
            email
            ${provider} {
                socialID
            }
        }
        `,
        loginErr
    )

    const valid = (
        user[provider] &&
        (user[provider].socialID === userInfo.id))
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

async function vote(parent, args, context, info) {
    const userId = getUserId(context)

    const linkExists = await context.db.exists.Vote({
        user: { id: userId },
        link: { id: args.linkId },
    })
    if (linkExists) {
        throw new Error(`Already voted for link: ${args.linkId}`)
    }

    return context.db.mutation.createVote(
        {
            data: {
                user: { connect: { id: userId } },
                link: { connect: { id: args.linkId } },
            },
        },
        info,
    )
}


const Mutation = {
    signupPassword,
    signupSocialProvider,
    loginPassword,
    loginSocialProvider,
    post,
    vote,
}

export default Mutation
