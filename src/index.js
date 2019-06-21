import express from "express"
import bodyParser from "body-parser"
import cors from "cors";
import { CloseCookie } from './cron'
import { FBFriendRoute, CapsRoutes } from './routes'

const app = express();

CloseCookie.start()

app.use(cors())

const port = 4200

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", FBFriendRoute);
app.use("/api", CapsRoutes);

app.listen(port)

console.log('Server running at', port);
// 4221093826050858
// 08 23
// 385