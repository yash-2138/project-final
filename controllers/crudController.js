const dbClient = require("../db.js")


exports.addStorage = (req, res)=>{
    try {
        const user_id = req.user_id;
        const {email, address, capacity} = req.body
        let so_id;
        const capacityBytes = capacity * Math.pow(1024, 3);
        dbClient.query('SELECT id FROM users where email = ?', [email], (err, result)=>{
          if(err){
            console.log(err);
            res.status(500).json(err);
          }else{
            so_id = result[0].id
            const data = {
              do_id: user_id,
              so_id: so_id,
              address:address,
              capacity: capacityBytes,
              remainingCapacity: capacityBytes,
            };

            dbClient.query(
              'SELECT * FROM myStorage WHERE do_id = ? AND so_id = ?',
              [user_id, so_id],
              (selectError, selectResults) => {
                  if (selectError) {
                  console.error(selectError);
                  res.status(500).json(selectError);
                  } else {
                  if (selectResults.length > 0) {
                      // Record already exists, send a response indicating that it's a duplicate
                      console.log('Duplicate entry found. Not inserting again.');
                      res.status(409).json({ message: 'Duplicate entry found.' });
                  } else {
                      // Record doesn't exist, proceed with the insertion
                      dbClient.query(
                      'INSERT INTO myStorage SET ?',
                      data,
                      (insertError, insertResults) => {
                          if (insertError) {
                          console.error(insertError);
                          res.status(500).json(insertError);
                          } else {
                          console.log('Data inserted successfully!');
                          res.status(200).json({ message: 'Data inserted successfully!' });
                          }
                      }
                      );
                  }
                  }
              }
              );
          }
        })
        

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateRemainingCapacity= (req,res)=>{
    try {
        const { user_id, usedCapacity } = req.body;
      
        // Check if a record with the specified user_id, email, and address exists
        dbClient.query(
          'SELECT * FROM myStorage WHERE user_id = ?',
          [user_id],
          (selectError, selectResults) => {
            if (selectError) {
              console.error(selectError);
              res.status(500).json(selectError);
            } else {
              if (selectResults.length === 0) {
                // Record doesn't exist, send a response indicating that it's not found
                console.log('Record not found. Cannot update remaining capacity.');
                res.status(404).json({ message: 'Record not found.' });
              } else {
                // Record found, update the remainingCapacity
                const existingRecord = selectResults[0];
                const remainingCapacity = existingRecord.remainingCapacity - usedCapacity;
                if(remainingCapacity < 0){
                    res.status(403).json({message: 'Not enough capacity.'})
                    return
                }
      
                // Update the remainingCapacity for the found record
                dbClient.query(
                  'UPDATE myStorage SET remainingCapacity = ? WHERE user_id = ? ',
                  [remainingCapacity, user_id],
                  (updateError, updateResults) => {
                    if (updateError) {
                      console.error(updateError);
                      res.status(500).json(updateError);
                    } else {
                      console.log('Remaining capacity updated successfully!');
                      res.status(200).json({ message: 'Remaining capacity updated successfully!' });
                    }
                  }
                );
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
      
}

exports.getStats= (req,res)=>{
  const user_id = req.user_id;
  // console.log(user_id)
  dbClient.query('SELECT type FROM users where id = ?', [user_id], (error, result) =>{
    if(error){
      console.log(error);
      res.send(500).json(error);
    }
    else if(result.length>0){
      let type = result[0].type
      if(type === "DO"){
        dbClient.query('SELECT * from myStorage where do_id = ?', [user_id], (error, result)=>{
          if(error){
            console.log(error)
            res.status(500).json(error)
          }
          else if(result){
            if(result.length > 0){
              res.send(result[0])
            }else{
              console.log("No Storage with this user");
              res.status(404).json({"msg":"No Storage with this user"})
            }
          }
        })
      }
      else if(type === "SO"){
        dbClient.query('SELECT * from myStorage where so_id = ?', [user_id], (error, result)=>{
          if(error){
            console.log(error)
            res.status(500).json(error)
          }
          else if(result){
            if(result.length > 0){
              res.send(result[0])
            }else{
              console.log("No Storage with this user");
              res.status(404).json({"msg": "No Storage with this user"})
            }
          }
        })
      }
    }else{
      res.status(404).json({"msg":"user not found"})
    }
  }) 
}

//only used when data owner sending files
// check user type
//if DO check if and storage is available with the DO
//add the filename and hash
exports.addFiles = (req,res) =>{
  const user_id = req.user_id;
  const {fileName, hash, size} = req.body.data;
  
  
  try {
    dbClient.query(
      'SELECT so_id, remainingCapacity, active FROM myStorage where do_id = ?', 
      [user_id],        
      (error, result)=>{
        if(error){
          res.status(500).json(error)
          return
        }
        if(result){
          if(result.length ==0){
            res.status(404).json({"msg": "No Storage Found"})
          }
          else{
            if(result[0].active == 1){
              let remainingCapacity = result[0].remainingCapacity - size;

              const data = {
                do_id: user_id,
                so_id: result[0].so_id,
                fileName: fileName,
                possession: "SO",
                fileHash: hash
              }
              dbClient.query('INSERT INTO files SET ?',
                data,
                (insertFileError,insertFileResult)=>{
                  if(insertFileError){
                    console.log(insertFileError)
                    res.status(500).json(insertFileError);
                  }
                  else if(insertFileResult){
                    console.log('Data inserted successfully in files table!');                          
                  }
                }
              )
              dbClient.query('UPDATE myStorage SET remainingCapacity = ? where do_id = ?',
                [remainingCapacity, user_id],
                (updateCapacityError, updateCapacityResult) =>{
                  if(updateCapacityError){
                    res.status(500).json(updateCapacityError);
                  }
                  else if(updateCapacityResult){
                    console.log('Capacity updated successfully in myStorage table!');
                    res.send({"msg": "Add Files Successfull."})                          
                  }
                }
              )
            }
            else{
              res.status(404).json({"msg": "Storage Found but inactive"})
            }
            
          }
        }

      }
    );
    
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

exports.getFilesSO =(req,res) =>{
  const user_id = req.user_id;
  dbClient.query(
    'SELECT do_id FROM myStorage WHERE so_id = ? AND active = 1',
    [user_id],
    (error, result) =>{
      if(error){
        return res.status(500).json(error)
      }
      if(result.length == 0) {
        return res.status(404).json({"msg": "No Storage Found"})
      }
      else{
        dbClient.query(
          'SELECT fileName, possession FROM files where do_id = ? and so_id = ?',
          [result[0].do_id, user_id],
          (fileError, fileResult)=>{
            if(fileError){
              return res.status(500).json(fileError)
            }
            if(fileResult.length == 0){
              return res.send({"msg": "No Files Rececived"})
            }
            else{
              return res.send(fileResult)
            }

          }
        )
      }
    })
}