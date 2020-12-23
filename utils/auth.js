import cookie from "js-cookie";
import Router from "next/router";

export function handleLogin(token) {
  cookie.set("token", token);
  Router.push("/account");
}

export function redirectUser(ctx, location) {
  // redirect in server
  if (ctx.req) {
    // context means server
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // else redirect in client if we are in client
    Router.push(location);
  }
}

export function handleLogout() {
  cookie.remove("token");
  window.localStorage.setItem("logout", Date.now());
  // universal logout
  // when we logout in one window we log out in any number of windows that we have opened
  Router.push("/login");
}
