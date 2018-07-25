import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


import Link from '../Link'

class LinkList extends Component {
    _updateCacheAfterVote = (store, createVote, linkId) => {
        const data = store.readQuery({ query: FEED_QUERY })

        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes

        store.writeQuery({ query: FEED_QUERY, data })
    }

    render() {
        const {feedQuery} = this.props
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
                    <Link
                        key={link.id}
                        link={link}
                        index={index}
                        updateStoreAfterVote={this._updateCacheAfterVote}
                    />
                ))}
            </div>
        )
    }
}

export const FEED_QUERY = gql`
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
