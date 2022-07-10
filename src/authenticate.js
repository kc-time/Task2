export const authenticate = (req, res, next) => {
    // middleware
    if (req.session.userid)
        next()
    else {
        return res.status(400).send('Please login first')
    }
}