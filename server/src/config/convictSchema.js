const socialAuthSchema = (service) => {
  const schema = {};
  schema[service] = {
    "appId": {
      doc: `The appID for ${service}`,
      format: String,
      env: service.toUpperCase() + "_APPID",
      default: null
    },
    "secret": {
      doc: `The app secret for ${service}`,
      format: String,
      env: service.toUpperCase() + "_SECRET",
      default: null
    }
  };
  return schema;
};

export default {
  "env": {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  "clientPort": {
    doc: "The port to bind for the static server for the client.",
    format: "port",
    default: 3000,
    env: "PORT"
  },
  "auth": {
    "socialServices": {
      doc: "A list of social authentication services to be used",
      format: Array,
      default: ['linkedin', 'twitter', 'facebook', 'github', 'google']
    },
    "sessionSecret": {
      doc: "A secret string for the server",
      format: String,
      env: "SESSION_SECRET",
      default: null
    },
    "token": {
      "secret": {
        doc: "The secret used to sign the JWT used for our auth token.",
        format: String,
        env: "TOKEN_SECRET",
        default: null
      },
      "issuer": {
        doc:
          ("The Issuer stored inside the JWT. " +
           "This is an indication of which service issued the token, " +
           "in scenarios where one auth service serves many apps."),
        format: String,
        env: "TOKEN_ISSUER",
        default: undefined
      },
      "audience": {
        doc:
          ("The audience stored inside the JWT. " +
           "This indicates which service the token is intended for, " +
           "in scenarios where one auth service serves many applications."),
        format: String,
        env: "TOKEN_AUDIENCE",
        default: undefined
      }
    },
    ...socialAuthSchema("linkedin"),
    ...socialAuthSchema("facebook"),
    ...socialAuthSchema("twitter"),
    ...socialAuthSchema("github"),
    ...socialAuthSchema("google"),
    ...socialAuthSchema("instagram"),
  },
  "prisma": {
    "typeDefs": {
      doc:
        ("The path to to the generated database prisma schema file"),
      format: String,
      env: "PRISMA_TYPE_DEFS",
      default: null
    },
    "endpoint": {
      doc:
        ("The URL for the database prisma endpoint."),
      format: String,
      env: "PRISMA_ENDPOINT",
      default: null
    },
    "secret": {
      doc:
        ("The secret for for the database prisma endpoint."),
      format: String,
      env: "PRISMA_SECRET",
      default: null
    },
  },
};
