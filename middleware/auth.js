// This code defines two middleware functions, adminAuth and userAuth, which are used for authentication and authorization purposes in an Express.js application.
// These middleware functions rely on JSON Web Tokens (JWTs) to determine if a user has the necessary role permissions to access certain routes.

const jwt = require("jsonwebtoken")
const jwtSecret = "cb9c3dc56e90692d95b2e65e3c3ce9f3ba6203e9a79d353e1c2ca22dee01fe822b12a5"


// This middleware function is designed to check if a user has the "admin" role.
exports.adminAuth = (req, res, next) => {
  // Expect a JWT token to be included in the request cookies with the key "jwt."
    const token = req.cookies.jwt
    if(token) {
      // Verify the JWT token and the jwtSecret provided.
        jwt.verify(token, jwtSecret, (err, decodeToken) => {
            if(err) {
                return res.status(401).json({ message: "Not authrized" })
            } else {
              // If the token is successfully verified, check the decodeToken.role to see if it equals "admin."
                if(decodeToken.role !== "admin") {
                  // If the token is present but the role is not "Basic,"  return a 401 Unauthorized response with a message indicating that the user is not authorized.
                    return res.status(401).json({ message: "Not authorized" })
                }else {
                  // Pass control to the next middleware or route handler, allowing access to admin-only routes.
                    next()
                }
            }
        })
    } else {
      // If the token is not present, return a 401 Unauthorized response with a message indicating that the user is not authorized because the token is not available.
        return res.status(401).json({ message: "Not authorized, token available" })
    }
}

// This middleware function is similar to adminAuth but is used to check if a user has a "Basic" role.
exports.userAuth = (req, res, next) => {
  //  Expect a JWT token to be included in the request cookies with the key "jwt."
    const token = req.cookies.jwt
    if (token) {
      // Verify the JWT token  and the jwtSecret provided.
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          // If the token is successfully verified, check the decodedToken.role to see if it equals "Basic."
          if (decodedToken.role !== "Basic") {
            // If the token is present but the role is not "Basic,"  return a 401 Unauthorized response with a message indicating that the user is not authorized.
            return res.status(401).json({ message: "Not authorized" })
          } else {
            //  Pass control to the next middleware or route handler, allowing access to routes that require basic user authentication.
            next()
          }
        }
      })
    } else {
      // If the token is not present, return a 401 Unauthorized response with a message indicating that the user is not authorized because the token is not available.
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }