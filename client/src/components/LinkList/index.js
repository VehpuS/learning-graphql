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
            {linksToRender.map((link, index) => (
                <Link key={link.id} link={link} index={index} />
            ))}
        </div>
    )
}

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList)
