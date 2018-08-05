const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

const getUserId = (context) => {
    const Authorization = context.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { userId } = jwt.verify(token, APP_SECRET)
        return userId
    }

    throw new Error('Not authenticated')
}

const getUserByEmail = async (db, email, query, loginErr) => {
    const user = await db.query.user(
        {
            where: { email: email }
        },
        query
    )
    if (!user) {
        throw loginErr
    }
    return user
}

export {
    APP_SECRET,
    getUserId,
    getUserByEmail,
}
