import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


import Link from '../Link'

const LinkList = ({feedQuery}) => {
    if (feedQuery && feedQuery.loading) {
        return <div>Loading</div>
    }

    if (feedQuery && feedQuery.error) {
        return <div>Error</div>
    }

    const linksToRender = feedQuery.feed.links

    return (
        <div>
            {linksToRender.map(link =>
                <Link key={link.id} link={link} />)}
        </div>
    )
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList)
