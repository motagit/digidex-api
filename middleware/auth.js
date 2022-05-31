import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization == null) {
            throw "You don't have permission!";
        }

        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData?.id;
        }

        next();

    } catch (error) {
        res.status(401).json({ message: error });
        console.log(error);
    }
}

export default auth;