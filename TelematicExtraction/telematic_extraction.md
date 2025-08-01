The file in this folder is a setup for periodically updating the main database with telematic features that will be used by the model to predict the credit score.

This entire API setup has been done while keeping the Damoov API EndPoint in mind. So, various features will not match up with the ones present in the final model, which is a constraint I face with the available resources.

This file by itself is properly working and if linked to a proper postgreSQL database and API, it will periodically update the data, every 5 minutes, in the database for the model to use.