import express from "express"
import bodyParser from "body-parser"
import cors from "cors";

import { FBFriendRoute } from './src/routes'

const app = express();

app.use(cors())

const port = 4200

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", FBFriendRoute);

app.listen(port)

console.log('Server running at', port);