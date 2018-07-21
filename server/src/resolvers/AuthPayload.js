function user(root, args, context, info) {
    return context.db.query.user({ where: { id: root.user.id } }, info)
}

const AuthPayload = { user }

export default AuthPayload