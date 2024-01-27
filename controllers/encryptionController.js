const crypto = require('crypto');

exports.getKey = (req,res)=>{
    try {
        const key = crypto.randomBytes(32);
        res.send({key: key.toString('hex')})  
    } catch (error) {
        res.status(500).json(error)
    }    
}