const dbClient = require("../db.js")


exports.addStorage = (req, res)=>{
    try {
        const user_id = req.user_id;
        console.log(user_id)
        const { email, address, capacity} = req.body
        const data = {
            email: email,
            address: address,
            capacity: capacity,
            remainingCapacity: capacity,
            user_id: user_id 
        };
        dbClient.query(
        'SELECT * FROM myStorage WHERE user_id = ? AND email = ? AND address = ?',
        [user_id, email, address],
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