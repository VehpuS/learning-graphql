const links = (parent, args, context, info) =>
    context.db.query.links({ where: { id_in: parent.linkIds } }, info)

const Feed = {
    links,
}

export default Feed