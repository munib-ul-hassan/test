import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./DB/index.js";
import { AuthMiddleware } from "./Router/Middleware/AuthMiddleware.js";
import { ResHandler } from "./Utils/ResponseHandler/ResHandler.js";
import { ApolloServer } from "apollo-server-express"; // Use apollo-server-express
import typeDefs from "./Typedefs/index.js";
import resolvers from "./Resolvers/index.js";
import http from "http";
const app = express();
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

// morganBody(app, {
//   prettify: true,
//   logReqUserAgent: true,
//   logReqDateTime: true,
// });

connectDB();


app.use(ResHandler);

async function startGraphQLServer() {
  const server = new ApolloServer({
    cors: {
      // "origin": "http://192.168.1.159:4000/",
      origin: "*",
      credentials: true
    },
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      try {
        const userToken = await AuthMiddleware(req);

        if (!userToken) {
          throw new Error("Unauthorized");
        }

        return { userToken };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  


  const httpServer = http.createServer(app);

  httpServer.listen(4000, () => {
    console.log("HTTPS Server running at port 4000");
  });
}

startGraphQLServer();

export default app;
