import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router'

import { AUTH_TOKEN } from '../../constants'
import {
    SIGNUP_SOCIAL_MUTATION,
    LOGIN_SOCIAL_MUTATION
} from './mutations'

const GOOGLE_APP_ID = process.env.REACT_APP_GOOGLE_APP_ID
console.log(GOOGLE_APP_ID)

class GoogleAuth extends React.Component {
    componentWillMount = () => this._initializeGoogleAPI()

    _initializeGoogleScript = () => {
        const id = "googleScript"
        const tag = 'script'
        let js
        const fjs = window.document.getElementsByTagName(tag)[0]
        if (window.document.getElementById(id)) {
            return
        }
        js = window.document.createElement(tag)
        js.id = id
        js.src = `https://apis.google.com/js/platform.js?onload=googleAPIInit`
        js.async = true
        js.defer = true
        fjs.parentNode.insertBefore(js, fjs)
    }

    _initializeGoogleAPI = () => {
        console.log("Initizliaing Google API.")
        window.googleAPIInit = () =>
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: GOOGLE_APP_ID
                })
            });

        this._initializeGoogleScript()
    }

    _handleGoogle = async (mutation) => {
        const GoogleAuth = window.gapi.auth2.getAuthInstance()
        const GoogleUser = await GoogleAuth.signIn({
            scope: 'profile email'
        })
        return this._GoogleCallback(GoogleUser, mutation)
    }

    _GoogleCallback = (GoogleUser, mutation) => {
        return (GoogleUser.isSignedIn()) ?
            mutation({ variables: {
                provider: 'google',
                providerToken: GoogleUser.getAuthResponse().id_token
            } }) :
            console.warn(`User did not authorize the Google application.`)
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
                        onClick={() => this._handleGoogle(mutation)}>
                        {`${login ? 'login' : 'create or link account'} with Google`}
                    </div>
                )}
            </Mutation>
        )
    }
}

export default withRouter(GoogleAuth)