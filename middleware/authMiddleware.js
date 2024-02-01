const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next)  =>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, 'yash dhumal secret', (err, decodedToken) =>{
            if(err){
                console.log(err);
                res.send({msg: "not_logged_in"})
            }else{
                // console.log(decodedToken);
                req.user_id = decodedToken.id;
                next()
            }

        })
    }else{
        res.send({msg: "not_logged_in"})
    }
}
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt
    if(token){
        jwt.verify(token, 'yash dhumal secret', (err, decodedToken) =>{
            if(err){
                console.log(err);
            }else{
                // console.log(decodedToken.id)
                req.user_id = decodedToken.id;
                next()
                
            }

        })
    }else{
        
        req.user_id = null;
        
    }
}
module.exports = {requireAuth, checkUser}