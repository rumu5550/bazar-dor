import dns from "node:dns";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db("bazar-dor");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "936958380954-1k4tmi2fh4jhse4o9rff7h1ufjkfsl64.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "Ov23liGCQvg1LTYJ6raa",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ||
        "8dd1c4ae49f4e02f4bd19d0b3e1aa6c3bae1a120",
    },
  },
});
