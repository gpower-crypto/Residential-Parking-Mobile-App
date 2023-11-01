Parking App, a React Native application for finding and saving nearby parking locations.

1. Navigate to the project directory:

cd parking-app

2. Install project dependencies:

npm install

3. Start the Expo development server:

npm start

4. Use a QR code scanner (Expo Go app on the mobile device or the camera app on iOS) to scan the QR code displayed in the terminal. This will open the app on your device.

Usage

1. Home Screen: This is the main screen where you can search for parking locations. Click on a location to view details or click the "Save" button to save it.

2. Location Selection: This screen displays nearby parking locations based on your search. Click on a location to view details or click the "Save" button to save it.

3. Parking Details: View detailed information about a parking location and get directions.

4. Saved Parking Locations: View a list of parking locations you have saved.

AsyncStorage

The application uses AsyncStorage to store your saved parking choices. It differentiates between regular parking choices and saved parking choices using separate keys:

1. "regularParkingChoices": Stores regular parking choices.
2. "savedParkingChoices": Stores saved parking choices.

Expo Snack Link: https://snack.expo.dev/@expomk/parking-slots-app
