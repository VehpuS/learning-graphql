async function feed(parent, args, context, info) {
    const where = 
        args.filter ?
        {
            OR: [
                { url_contains: args.filter },
                { description_contains: args.filter },
            ],
        } : {}

    const { skip, first, orderBy} = args
    const queryArgs = { where, skip, first, orderBy }
    const queriedLinks = await context.db.query.links(queryArgs, `{ id }`)

    const countSelectionSet = `{
      aggregate {
        count
      }
    }`

    const linksConnection = await context.db.query.linksConnection({}, countSelectionSet)

    return {
        count: linksConnection.aggregate.count,
        linkIds: queriedLinks.map(link => link.id),
    }
}

    
const Query = {
    feed
}

export default Query
