// deno-lint-ignore-file no-explicit-any
import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { validateJwt } from "../modules/validate.ts";

import { key } from "../config.ts";

const authMiddleware = async (ctx: Context, next: any) => {
  const headers: Headers = ctx.request.headers;
  const authorization = headers.get("Authorization");
  if (!authorization) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Header : Authorization" };
    return;
  }
  const jwt = authorization.split(" ")[1];
  if (!jwt) {
    ctx.response.status = 401;
    ctx.response.body = { message: "JWT is necessary" };
    return;
  }
  
  if (await validateJwt(jwt, key, { isThrowing: false })) {
    await next();
    return;
  }

  ctx.response.status = 401;
  ctx.response.body = { message: "Invalid jwt token" };
};

export { authMiddleware };