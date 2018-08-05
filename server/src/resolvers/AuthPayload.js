const user = (root, args, context, info) =>
    context.db.query.user({ where: { id: root.user.id } }, info)

const AuthPayload = { user }

export default AuthPayload