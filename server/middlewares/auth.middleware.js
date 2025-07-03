import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            error : "Unauthorised request"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({error : "Invalid Token"});
    }
}

