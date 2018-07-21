const feed = (parent, args, context, info) => {
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
    return context.db.query.links(queryArgs, info)
}

    
const Query = {
    feed
}

export default Query
