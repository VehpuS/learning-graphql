import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { AUTH_TOKEN } from '../../constants'

class Login extends Component {
    state = {
        login: true, // switch between Login and SignUp
        email: '',
        password: '',
        name: '',
    }

    render() {
        const { login, email, password, name } = this.state
        return (
            <div>
                <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
                <div className="flex flex-column">
                    {!this.state.login && (
                        <input
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                            type="text"
                            placeholder="Your name"
                        />
                    )}
                    <input
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="text"
                        placeholder="Your email address"
                    />
                    <input
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                </div>
                <div className="flex mt3">
                    <Mutation
                        mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{ email, password, name }}
                        onCompleted={data => this._confirm(data)}
                    >
                        {mutation => (
                            <div className="pointer mr2 button" onClick={mutation}>
                                {login ? 'login' : 'create account'}
                            </div>
                        )}
                    </Mutation>
                    <div
                        className="pointer button"
                        onClick={() => this.setState({ login: !login })}
                    >
                        {login ? 'need to create an account?' : 'already have an account?'}
                    </div>
                </div>
            </div>
        )
    }

    _confirm = async ({ login, signup }) => {
        const { token } = this.state.login ? login : signup
        this._saveUserData(token)
        this.props.history.push(`/`)
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }
}


const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export default Login
