const jwt = require("jsonwebtoken")
const jwtSecret = "cb9c3dc56e90692d95b2e65e3c3ce9f3ba6203e9a79d353e1c2ca22dee01fe822b12a5"

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodeToken) => {
            if(err) {
                return res.status(401).json({ message: "Not authrized" })
            } else {
                if(decodeToken.role !== "admin") {
                    return res.status(401).json({ message: "Not authorized" })
                }else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({ message: "Not authorized, token available" })
    }
}


exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }