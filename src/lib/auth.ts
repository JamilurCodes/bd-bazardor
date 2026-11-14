import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// Fail fast at startup instead of running with a broken auth setup.
const mongoUri = process.env.MONGODB_URI;
const authBaseUrl = process.env.BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required.");
}

if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL is required.");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is required.");
}

// Reuse one MongoDB client across dev hot reloads so each reload
// doesn't open a new connection pool and exhaust the server.
const globalForMongo = globalThis as typeof globalThis & {
  bazarDorMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.bazarDorMongoClient ??
  new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bazarDorMongoClient = mongoClient;
}

const databaseName = process.env.MONGODB_DB_NAME || "bd-bazardor";
const database = mongoClient.db(databaseName);

// Only enable a social provider when both credentials are configured;
// Better Auth errors on providers with empty credentials.
const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),

  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  appName: "BazarDor",

  baseURL: authBaseUrl,
  secret: authSecret,

  // The Mongo adapter needs the raw client to run transactions
  // (supported on MongoDB Atlas replica sets).
  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },

  socialProviders,
});
