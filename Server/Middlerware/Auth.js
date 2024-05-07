const jwt = require('jsonwebtoken');

const AuthAccessToken = async (req, res, next) => {
    try {
        // console.log(req.header.cookies.split("=")[1]);
        // console.log(req.cookies.token);
        // console.log("headers",req.headers.cookie.split(';')['token']);

        // const cookies = req.headers.cookie.split(';');
        // console.log('cookie',cookies);
        // let tokenValue = null;
        // for (const cookie of cookies) {
        //     const [name, value] = cookie.trim().split('=');
        //     if (name === 'token') {
        //         tokenValue = value;
        //         break; // Exit the loop once token value is found
        //     }
        // }

        console.log(req.headers)

        if (req.headers.token) {
            jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, payload) => {
                if (err) {
                    console.log(err);
                    return res.status(404).send("Unathorized");
                }
                req.payload = payload;
                next();
            });
        }
        else {
            res.status(401).send("Token not found");
        }
        // console.log(req.cookies.token);
        //   res.status(200).send("message");
    }
    catch (error) {
        next(error);
    }
}

const AuthRefreshToken = async (refreshtoken) => {
    try {
        // console.log(req.header.cookies.split("=")[1]);
        //    if(req.cookies.refreshtoken){
        return new Promise((resolve, reject) => {
            jwt.verify(refreshtoken, process.env.SECRET_KEY_2, (err, decoded) => {
                if (err) {
                    reject(err); // Reject if there's an error
                } else {
                    // Resolve with the decoded payload if verification is successful
                    resolve(decoded);
                }
            });
        });


        //    }
        //    else{
        //     res.status(404).send("Token not found");
        //    }
        // console.log(req.cookies.token);
        //   res.status(200).send("message");
    }
    catch (error) {
        next(error);
    }
}

module.exports = { AuthAccessToken, AuthRefreshToken };