var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// @ts-ignore
import got from "got";
import { createHmac } from "crypto";
import OAuth from "oauth-1.0a";
import express from "express";
import cors from "cors";
var app = express();
app.use(cors());
var consumer_key = process.env.consumer_key;
var consumer_secret = process.env.consumer_secret;
var oauth_token = process.env.oauth_token;
var oauth_token_secret = process.env.oauth_token_secret;
// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
function getRandomHash(length) {
    if (length === void 0) { length = 5; }
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
var data = {
    text: "API test: Hello world! - " + getRandomHash(),
};
var endpointURL = "https://api.twitter.com/2/tweets";
var oauth = new OAuth({
    consumer: {
        key: consumer_key,
        secret: consumer_secret,
    },
    signature_method: "HMAC-SHA1",
    hash_function: function (baseString, key) { return createHmac("sha1", key).update(baseString).digest("base64"); },
});
function getRequest(_a) {
    var oauth_token = _a.oauth_token, oauth_token_secret = _a.oauth_token_secret;
    return __awaiter(this, void 0, void 0, function () {
        var token, authHeader, req;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = {
                        key: oauth_token,
                        secret: oauth_token_secret,
                    };
                    authHeader = oauth.toHeader(oauth.authorize({
                        url: endpointURL,
                        method: "POST",
                    }, token));
                    return [4 /*yield*/, got.post(endpointURL, {
                            json: data,
                            responseType: "json",
                            headers: {
                                Authorization: authHeader["Authorization"],
                                "user-agent": "v2CreateTweetJS",
                                "content-type": "application/json",
                                accept: "application/json",
                            },
                        })];
                case 1:
                    req = _b.sent();
                    if (req.ok) {
                        return [2 /*return*/, req.body];
                    }
                    else {
                        console.log(req);
                        throw new Error("Unsuccessful request");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
app.post("/tweet", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getRequest({
                        oauth_token: oauth_token,
                        oauth_token_secret: oauth_token_secret,
                    })];
            case 1:
                response = _a.sent();
                res.send({ response: response });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.send({ error: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log("Server running on: http://localhost:3000");
});
