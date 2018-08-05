import gql from 'graphql-tag'

const SIGNUP_PASSWORD_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signupPassword(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_PASSWORD_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    loginPassword(email: $email, password: $password) {
      token
    }
  }
`


const SIGNUP_SOCIAL_MUTATION = gql`
  mutation SignupMutation($provider: Provider!, $providerToken: String!) {
    signupSocialProvider(provider: $provider, providerToken: $providerToken) {
      token
    }
  }
`

const LOGIN_SOCIAL_MUTATION = gql`
  mutation LoginMutation($provider: Provider!, $providerToken: String!) {
    loginSocialProvider(provider: $provider, providerToken: $providerToken) {
      token
    }
  }
`
export {
    SIGNUP_PASSWORD_MUTATION,
    LOGIN_PASSWORD_MUTATION,
    SIGNUP_SOCIAL_MUTATION,
    LOGIN_SOCIAL_MUTATION,
}