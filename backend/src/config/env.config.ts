export const envConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.CLIENT_URL! || "http://localhost:3000",

  database: {
    url: process.env.DATABASE_URL!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
    geminiApiKey: process.env.GEMINI_API_KEY!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiration: process.env.JWT_EXPIRATION || "7d",
  },
  imagekit: {
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  },
  jsearch: {
    apiKey: process.env.JSEARCH_API_KEY!,
  },
};
