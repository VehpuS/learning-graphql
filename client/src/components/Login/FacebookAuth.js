import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'

import { AUTH_TOKEN } from '../../constants'

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID
const FACEBOOK_API_VERSION = 'v3.1'


const SIGNUP_MUTATION = gql`
  mutation SignupMutation($provider: Provider!, $providerToken: String!) {
    signupSocialProvider(provider: $provider, providerToken: $providerToken) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($provider: Provider!, $providerToken: String!) {
    loginSocialProvider(provider: $provider, providerToken: $providerToken) {
      token
    }
  }
`

class FacebookAuth extends React.Component {
    componentWillMount = () => this._initializeFacebookSDK()

    _initializeFacebookSDKScripts = (d, s, id) => {
        let js
        const fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
            return
        }
        js = d.createElement(s)
        js.id = id
        js.src = `https://connect.facebook.net/en_US/sdk.js`
        fjs.parentNode.insertBefore(js, fjs)
    }
    _initializeFacebookSDK() {
        console.log("Initizliaing facebook SDK.")
        window.fbAsyncInit = () =>
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                autoLogAppEvents: true,
                xfbml: true,
                version: FACEBOOK_API_VERSION,
            })

        this._initializeFacebookSDKScripts(window.document, 'script', 'facebook-jssdk')

    }

    _handleFB = (mutation) =>
        window.FB.login(response => {
            this._facebookCallback(response, mutation)
        }, { scope: 'email,public_profile' })

    _facebookCallback = (facebookResponse, mutation) => {
        return (facebookResponse.status === 'connected' &&
                facebookResponse.authResponse &&
                facebookResponse.authResponse.accessToken) ?
            mutation({ variables: {
                provider: 'facebook',
                providerToken: facebookResponse.authResponse.accessToken
            } }) :
            console.warn(`User did not authorize the Facebook application.`)
    }

    _confirm = async ({ loginSocialProvider, signupSocialProvider }) => {
        const { login } = this.props
        const { token } = login ? loginSocialProvider : signupSocialProvider
        this._saveUserData(token)
        this.props.history.push(`/`)
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    render() {
        const {login} = this.props
        return (
            <Mutation className="pointer mr2 button"
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                onCompleted={data => this._confirm(data)}
            >
                {mutation => (
                    <div className="pointer mr2 button"
                        onClick={() => this._handleFB(mutation)}>
                        {`${login ? 'login' : 'create or link account'} with Facebook`}
                    </div>
                )}
            </Mutation>
        )
    }
}

export default withRouter(FacebookAuth)