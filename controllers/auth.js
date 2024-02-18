const dbClient = require("../db.js")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const maxAge = 3 * 34 * 60 * 60 ;
exports.register = (req,res)=>{
    const {name, email, password, type} = req.body

    dbClient.query('SELECT email from users WHERE email = ?', [email], async(error, results)=>{
        if(error){
            return res.status(401).send(error);
        }
        if(results && results.length > 0){
            res.status(409).send({"type":"already registered"})
        }
        else{
            let hashedPass = await bcrypt.hash(password, 8)
            dbClient.query('INSERT INTO users (name, email, password, type) values (?, ?, ?, ?)', [name, email, hashedPass, type], (error, results)=>{
                if(error){
                    console.log(error);
                }
                else{
                    res.send({"msg":"success"})
                }
            })
        }
        
    })
    
   
}

exports.login = async(req, res)=>{
    const {email, password} = req.body;
    
    let hashedPass = await bcrypt.hash(password, 8)
    dbClient.query('SELECT * FROM users WHERE email = ?', [email], async(error, results)=>{
        if(error){
            console.log(error);
            return res.status(401).send(error);
        }
        if(results.length === 0){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        else{
            const hashedPassFromDB = results[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassFromDB);

            if (!passwordMatch) {
                // Passwords do not match
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Login successful, you can now use the user ID
                const userId = results[0].id;
                const name = results[0].name;
                const type = results[0].type;
                const token =  createToken(userId, name, type);
                res.cookie('jwt', token,{httpOnly: true, maxAge: maxAge * 1000})
                res.status(201).json({user: userId})
        }
    })    
}
exports.getName = (req, res) =>{
    const user_id = req.user_id
    try {
        dbClient.query('SELECT name, type from users WHERE id = ?', [user_id], async(error, results)=>{
            if(error){
                return res.status(401).send(error);
            }
            else{
                // console.log(results)
                res.send(results[0])               
            }
            
        })
    } catch (error) {
        res.status(500).json(error)
    }
    
}

exports.logout =(req, res)=>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/home') //update this
}
const createToken = (id, name, type)=>{
    return jwt.sign({id, name, type}, 'yash dhumal secret',{
        expiresIn: maxAge
    })
}