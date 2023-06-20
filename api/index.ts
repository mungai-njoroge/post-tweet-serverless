// @ts-ignore
import got from "got";
import "dotenv/config";

import { createHmac } from "crypto";
import OAuth from "oauth-1.0a";
import cors from "cors";

import express from "express";

const app = express();
const { json, urlencoded } = express;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  OAUTH_TOKEN,
  OAUTH_TOKEN_SECRET,
  API_KEY,
} = process.env;

const endpointURL = `https://api.twitter.com/2/tweets`;

const oauth = new OAuth({
  consumer: {
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    createHmac("sha1", key).update(baseString).digest("base64"),
});

interface Request {
  oauth_token: string;
  oauth_token_secret: string;
  tweet: {
    text: string;
  };
}

async function sendTweet(data: Request) {
  const token = {
    key: data.oauth_token,
    secret: data.oauth_token_secret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: "POST",
      },
      token
    )
  );

  const req = await got.post(endpointURL, {
    json: data.tweet,
    responseType: "json",
    headers: {
      Authorization: authHeader["Authorization"],
      "user-agent": "v2CreateTweetJS",
      "content-type": "application/json",
      accept: "application/json",
    },
  });

  if (req.ok) {
    return req.body;
  } else {
    console.log(req);
    throw new Error("Unsuccessful request");
  }
}

app.post("/api/tweet", async (req, res) => {
  const { api_key } = req.query;

  if (!api_key || api_key !== API_KEY) {
    return res.status(401).send({ error: "Missing or Invalid API KEY" });
  }

  try {
    const { text } = req.body;

    const response = await sendTweet({
      oauth_token: OAUTH_TOKEN,
      oauth_token_secret: OAUTH_TOKEN_SECRET,
      tweet: { text },
    });

    res.send({ response });
  } catch (error) {
    res.send({ error });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on: http://localhost:" + PORT);
});
