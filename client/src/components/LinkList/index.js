import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { getTimeDifference } from '../../utils'
import {LINKS_PER_PAGE} from '../../constants'


import Link from '../Link'

class LinkList extends Component {
    _updateCacheAfterVote = (store, createVote, linkId) => {
        const data = store.readQuery({
            query: FEED_QUERY,
            variables: this._getQueryVariables()
        })

        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes
        store.writeQuery({ query: FEED_QUERY, data })
    }


    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newLink = subscriptionData.data.newLink.node

                return {
                    ...prev,
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
                        __typename: prev.feed.__typename
                    }
                }
            }
        })
    }

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    }

    _isNewPage = () => this.props.location.pathname.includes('new')
    _getPage = () => parseInt(this.props.match.params.page, 10)

    _getQueryVariables = () => {
        const isNewPage = this._isNewPage()

        const skip = isNewPage ? (this._getPage() - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return { first, skip, orderBy }
    }

    _getLinksToRender = data => {
        const rankedLinks = [...data.feed.links]
        const sortFunc = this._isNewPage() ?
            getTimeDifference :
            (l1, l2) => l2.votes.length - l1.votes.length
        rankedLinks.sort(sortFunc)
        return rankedLinks
    }

    _nextPage = data => {
        const page = this._getPage()
        if (page <= (data.feed.count - 1) / LINKS_PER_PAGE) {
            const nextPage = page + 1
            this.props.history.push(`/new/${nextPage}`)
        }
    }

    _previousPage = () => {
        const page = this._getPage()
        if (page > 1) {
            const previousPage = page - 1
            this.props.history.push(`/new/${previousPage}`)
        }
    }

    render() {
        return (
            <Query
                query={FEED_QUERY}
                variables={this._getQueryVariables()}>
                {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>

                    this._subscribeToNewLinks(subscribeToMore)
                    this._subscribeToNewVotes(subscribeToMore)

                    const linksToRender = this._getLinksToRender(data)
                    const pageIndex = this.props.match.params.page
                        ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
                        : 0

                    return (
                        <React.Fragment>
                            {linksToRender.map((link, index) => (
                                <Link
                                    key={link.id}
                                    link={link}
                                    index={index + pageIndex}
                                    updateStoreAfterVote={this._updateCacheAfterVote}
                                />
                            ))}
                            {this._isNewPage() && (
                                <div className="flex ml4 mv3 gray">
                                    <div className="pointer mr2" onClick={() => this._previousPage()}>
                                        Previous
                                    </div>
                                    <div className="pointer" onClick={() => this._nextPage(data)}>
                                        Next
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )
                }}
            </Query>
        )
    }
}

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
        id
        url
        description
        createdAt
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
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
        user {
          id
        }
      }
    }
  }
`

export default LinkList
