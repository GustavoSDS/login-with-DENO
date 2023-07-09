import { User } from "../types/user.ts";
import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt@v1.7/create.ts";

import { key } from "../config.ts";

//Array users
const users: Array<User> = [
  {
    id: "1",
    username: "jdoe@example.com",
    password: "1234",
  },
  {
    id: "2",
    username: "gustavo@gmail.com",
    password: "1234",
  },
];

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

//login user
const login = async (ctx: Context) => {
  //get values from body request
  const { value } = await ctx.request.body();
  //iterate array users
  const result = await value;

  const user = users.filter((x) => x.username === result.username);

  if (user.length !== 0) {
    if (result.username === user[0].username
      && result.password === user[0].password) {

      const payload: Payload = {
        iss: user[0].username,
        exp: setExpiration(new Date().getTime() + 50000),
      };

      //create jwt previous condition ok
      const jwt = await makeJwt({ key, header, payload });
      if (jwt) {
        // response jwt
        ctx.response.status = 200;
        ctx.response.body = {
          id: user[0].id,
          username: user[0].username,
          jwt,
        };
      } else {
        // if error, response code 500
        ctx.response.status = 500;
        ctx.response.body = {
          message: "Internal error server",
        };
      }
      return;
    } else {
      //credentials wrong
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Invalid username or password",
      };
    }
  } else {
    //user not found in db
    ctx.response.status = 400;
    ctx.response.body = {
      message: "User not found in database",
    };
  }
};

export { login };