const newLinkSubscribe = (parent, args, context, info) =>
    context.db.subscription.link(
        { where: { mutation_in: ['CREATED'] } },
        info,
    )

const newLink = {
    subscribe: newLinkSubscribe
}

const Subscription = {
    newLink,
}

export default Subscription