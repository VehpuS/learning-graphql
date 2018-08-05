import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router'

import { AUTH_TOKEN } from '../../constants'
import {
    SIGNUP_SOCIAL_MUTATION,
    LOGIN_SOCIAL_MUTATION
} from './mutations'

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID
const FACEBOOK_API_VERSION = 'v3.1'

class FacebookAuth extends React.Component {
    componentWillMount = () => this._initializeFacebookSDK()

    _initializeFacebookSDKScripts = () => {
        const id = 'facebook-jssdk'
        const tag = 'script'
        let js
        const fjs = window.document.getElementsByTagName(tag)[0]
        if (window.document.getElementById(id)) {
            return
        }
        js = window.document.createElement(tag)
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

        this._initializeFacebookSDKScripts()
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
                mutation={login ? LOGIN_SOCIAL_MUTATION : SIGNUP_SOCIAL_MUTATION}
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