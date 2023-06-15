// @ts-ignore
import got from "got"; 

import { createHmac } from "crypto";
import OAuth from "oauth-1.0a";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const consumer_key = process.env.consumer_key as string;
const consumer_secret = process.env.consumer_secret as string;

const oauth_token = process.env.oauth_token as string;
const oauth_token_secret = process.env.oauth_token_secret as string;

// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.

function getRandomHash(length = 5) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const data = {
  text: "API test: Hello world! - " + getRandomHash(),
};

const endpointURL = `https://api.twitter.com/2/tweets`;

const oauth = new OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) => createHmac("sha1", key).update(baseString).digest("base64"),
});

async function getRequest({ oauth_token, oauth_token_secret }) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
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
    json: data,
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

app.post("/tweet", async (req, res) => {
  try {
    const response = await getRequest({
      oauth_token,
      oauth_token_secret,
    });

    res.send({ response });
  } catch (error) {
    res.send({ error });
  }
});

app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000");
});
