import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-client-preset'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'


const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    // const token = localStorage.getItem(AUTH_TOKEN)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamp2ZG51bzUwMDNqMDc1N3lzcnozOW9qIiwiaWF0IjoxNTMyMTc1MzY1fQ.OeqIQt8metmDLotblsvs-0h5lxsmsd6XVwDpVq_kMOY"
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
        headers: {
            authorization: authorizationHeader
        }
    })
    return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    cache: new InMemoryCache()
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , document.getElementById('root')
)
registerServiceWorker()
