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

        dbClient.query('UPDATE files SET request = ? where fileName = ? and do_id = ? and so_id = ?',
            ['active', file, user_id, so_id],
            (filesError, filesResult) =>{
                if(filesError) {
                    console.log(filesError);
                    return res.status(500).json(filesError);
                }
                res.send({'msg': 'Success'})
            }
        )
        
        
        dbClient.query('SELECT email FROM users where id = ?', [so_id], (errorGettingEmail, resultEmail) => {
            if (errorGettingEmail) {
                console.log(errorGettingEmail)
                // return res.status(500).json(errorGettingEmail);
            }
            if (resultEmail.length == 0) {
                console.log('No User Found to send mail!')
                // return res.status(404).json({ "msg": "No User Found" });
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
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            }
        });
    });
}




//contract end notification

const notifyDataOwner = ()=>{
    const date = new Date();
    try {
        dbClient.query(
            'SELECT do_id, endDate FROM myStorage where active = 1',
            (error, results) => {
                if(error){
                    onsole.error("Error querying database:", error);
                    return
                }
                if(results.length > 0){
                    for(let i = 0;i < results.length; i++){
                        const endDate = new Date(results[i].endDate);
                        const timeDifference = endDate.getTime() - date.getTime();
                        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
                        
                        if (daysDifference <= 5 && daysDifference >= 0) {
                            console.log(`Notify data owner for do_id: ${results[i].do_id}`);
                            dbClient.query(
                                'SELECT email FROM users where id = ?',
                                [results[i].do_id],
                                (errorGettingEmail, resultEmail) => {
                                if (errorGettingEmail) {
                                    console.log(errorGettingEmail)
                                    return 
                                }
                                if (resultEmail.length == 0) {
                                    console.log("No User Found for sending notification mail")
                                    return 
                                }
                                if (resultEmail.length > 0) {
                                    receiverEmail = resultEmail[0].email;
                    
                                    const mailOptions = {
                                        from: 'ydydyd2138@gmail.com', // Replace with your email
                                        to: receiverEmail,
                                        subject: 'Allert !! Contract Ending',
                                        text: `Your contract is about to end on ${results[i].endDate}!!
                                                Get your files back !!
                                        `,
                                    };
                    
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.error('Error sending email:', error.message);
                                            return 
                                        } else {
                                            console.log('Email sent:', info.response);
                                            return 
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            // console.log(daysDifference)
                        }
    
                    }
                }
            }
        ) 
    } catch (error) {
        console.log(error)
    }
    
}

// setInterval(notifyDataOwner, 60000)
setInterval(notifyDataOwner, 86400000)