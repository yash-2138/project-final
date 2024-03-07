const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next)  =>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, 'yash dhumal secret', (err, decodedToken) =>{
            if(err){
                console.log(err);
                res.render('login')
            }else{
                req.userName = decodedToken.name
                req.userType = decodedToken.type
                req.user_id = decodedToken.id;
                req.email = decodedToken.email;
                next()
            }

        })
    }else{
        res.render('login')
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
                req.userName = decodedToken.name
                req.userType = decodedToken.type
                req.user_id = decodedToken.id;
                req.email = decodedToken.email;
                // console.log("user_id:", decodedToken.id)
                next()
                
            }

        })
    }else{
        
        req.user_id = null;
        next()
        
    }
}
module.exports = {requireAuth, checkUser}