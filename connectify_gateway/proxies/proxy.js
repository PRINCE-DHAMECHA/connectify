const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

const setupProxies = (app, routes, path) => {
  routes.forEach((r) => {
    const proxyConfig = {
      target: path,
      withCredentials: true,
      onProxyReq: (proxyReq, req, res) => {
        if (req.user) {
          const token = jwt.sign(
            { email: req.user.email, userId: req.user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          proxyReq.setHeader("Authorization", `Bearer ${token}`);
        }

        if ((req.method === "POST" || req.method === "PUT") && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    };

    if (r.auth) {
      app.use(r.url, auth, createProxyMiddleware(proxyConfig));
    } else {
      app.use(r.url, createProxyMiddleware(proxyConfig));
    }
  });
};

exports.setupProxies = setupProxies;
