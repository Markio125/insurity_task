This is a project for Interview qualification at Insurity.

I have divided my program into multiple subsections each dealing with various aspects of the project. Some of the aspects are not linked together due to time constraints or other issues, but individually each section works properly in itself.

TelematicExtraction - This folder consists of code to extract telematic information from Damoov API and to periodically update it onto the main DB every 5 or 10 minutes. Access to the API is not available to me as it is a paid service, but the outline has been made in line with actual working of the API.

ModelTraining - In this folder, I have worked on a mock dataset (information regarding which is specified in the report and the Ipynb notebook). The notebook goes over the features I have emplyed and basic analysis and feature Engineering that I was able to perform on the dataset.

CreditScorePredictor and ModelServer - The trained model is being hosted locally using FastAPI and CreditScoreUpdated uses this API to make predictions for the rows present in the TelematicsCreditScore database in an hourly basis. This updated values are stored in the credit_score table in the database and is updated on an hourly basis.

API_Endpoints - Another FastAPI server to which the Frontend makes API requests to access information stored in the credit_score table when it is required by a user visiting the site.

Running procedure:

For Backend: In Terminal 1
cd Backend/API_Endpoints
python site_backend_server.py

For Frontend: In Terminal 2
cd Frontend
npm install
npm run dev