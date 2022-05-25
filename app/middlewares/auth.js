const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization

    if (!token) throw new CustomError('Token was not found', 403)
    if (token.slice(0, 7) !== 'Bearer ') throw new CustomError('Token is invalid', 401)
    token = token.slice(7)

    await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) throw new CustomError('Token has expired', 401)

      req.user = user
      next()
    })
  } catch (err) {
    next(err)
  }
}

const generateAccessToken = (user) =>
  // expires after one week (604800 seconds = 1 week)
  jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '604800s' })

module.exports = {
  authMiddleware,
  generateAccessToken,
}
