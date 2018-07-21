const feed = (parent, args, context, info) =>
    context.db.query.links({}, info)

const Query = {
    feed
}

export default Query
