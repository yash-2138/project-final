const dbClient = require("../db.js")
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ydydyd2138@gmail.com', 
        pass: process.env.PASSWORD, 
    },
});


exports.sendMailToMyStorageProvider = (req, res) => {
    const user_id = req.user_id;
    const { joinId } = req.body;
    let so_id, receiverEmail;

    
    dbClient.query('SELECT so_id FROM myStorage where do_id = ?', [user_id], (error, result) => {
        if (error) {
            return res.status(500).json(error);
        }
        if (result.length == 0) {
            return res.status(404).json({ "msg": "No Storage Found" });
        }
        if (result.length > 0) {
            so_id = result[0].so_id;
        }

        
        dbClient.query('SELECT email FROM users where id = ?', [so_id], (errorGettingEmail, resultEmail) => {
            if (errorGettingEmail) {
                return res.status(500).json(errorGettingEmail);
            }
            if (resultEmail.length == 0) {
                return res.status(404).json({ "msg": "No User Found" });
            }
            if (resultEmail.length > 0) {
                receiverEmail = resultEmail[0].email;

                const mailOptions = {
                    from: 'ydydyd2138@gmail.com', // Replace with your email
                    to: receiverEmail,
                    subject: 'Room ID for File Sharing',
                    text: `Your room ID for file sharing is: ${joinId}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error.message);
                        return res.status(500).json(error);
                    } else {
                        console.log('Email sent:', info.response);
                        return res.send({ "msg": "Success" });
                    }
                });
            }
        });
    });
};

exports.requestFile = (req,res)=>{
    const user_id = req.user_id;
    const {file} = req.body
    let so_id, receiverEmail, file_id;

    
    dbClient.query('SELECT so_id FROM myStorage where do_id = ?', [user_id], (error, result) => {
        if (error) {
            return res.status(500).json(error);
        }
        if (result.length == 0) {
            return res.status(404).json({ "msg": "No Storage Found" });
        }
        if (result.length > 0) {
            so_id = result[0].so_id;
        }

        dbClient.query('SELECT id FROM files where fileName = ? and do_id = ? and so_id = ?',
            [file, user_id, so_id],
            (filesError, filesResult) =>{
                if(filesError) {
                    console.log(filesError);
                    return res.status(500).json(filesError);
                }
                if(filesResult == 0) {
                    return res.status(404).json({"msg": "no files found"});
                }
                if(filesResult.length > 0){
                    file_id = filesResult[0].id
                    const data = {
                        do_id: user_id,
                        so_id: so_id,
                        file_id: file_id,
                        state: 'active'
                    }
                    //insert data into filerequests table
                    dbClient.query('INSERT into filerequests set ?',
                        [data],
                        (fileRequestError, fileRequestResults)=>{
                            if(fileRequestError){
                                console.log(fileRequestError)
                                if(fileRequestError.sqlState == 23000){
                                    return res.status(409).json({"msg": "duplicate request"})
                                }
                                return res.status(500).json(fileRequestError)
                            }
                            if(fileRequestResults){
                                console.log('Request Added Successfully')
                            }

                        }
                    )                    
                }
            }
        )
        
        
        dbClient.query('SELECT email FROM users where id = ?', [so_id], (errorGettingEmail, resultEmail) => {
            if (errorGettingEmail) {
                return res.status(500).json(errorGettingEmail);
            }
            if (resultEmail.length == 0) {
                return res.status(404).json({ "msg": "No User Found" });
            }
            if (resultEmail.length > 0) {
                receiverEmail = resultEmail[0].email;

                const mailOptions = {
                    from: 'ydydyd2138@gmail.com', // Replace with your email
                    to: receiverEmail,
                    subject: 'Request to return file',
                    text: `File named ${file} needs to be returned.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error.message);
                        return res.status(500).json(error);
                    } else {
                        console.log('Email sent:', info.response);
                        return res.send({ "msg": "Success" });
                    }
                });
            }
        });
    });
}
