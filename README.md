## Parking App Video Demo

[![Demo Video](https://img.youtube.com/vi/hbkWpIMpD-c/0.jpg)](https://www.youtube.com/watch?v=hbkWpIMpD-c)

# Residential Parking App

Residential Parking App is a React Native application designed to help users find and save nearby parking locations in residential areas. The Nodejs server API (open source) that provides the respective parking and other data is [here](https://github.com/gpower-crypto/Residential-Parking-API).

## Getting Started

1. Navigate to the project directory:

   ```bash
   cd parking-app
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Use a QR code scanner (Expo Go app on the mobile device or the camera app on iOS) to scan the QR code displayed in the terminal. This will open the app on your device.

## Usage

1. **Home Screen**: The main screen allows you to search for nearby residential parking locations. Click on a location to view details or click the "Save" button to save it.

2. **Location Selection**: This screen displays nearby residential parking locations based on your search by implementing Dijkstra's shortest path algorithm using cached map data to optimize driving routes, reducing reliance on external mapping services. Click on a location to view details or click the "Save" button to save it.

3. **Parking Details**: View detailed information about a parking location and get directions.

4. **Saved Parking Locations**: View a list of parking locations you have saved.

## AsyncStorage

The application uses AsyncStorage to store your saved parking choices. It differentiates between regular parking choices and saved parking choices using separate keys:

1. `"regularParkingChoices"`: Stores regular parking choices.
2. `"savedParkingChoices"`: Stores saved parking choices.

## AI Chatbot Feature

The application incorporates an AI chatbot feature to provide parking assistance and enhance user interaction. The chatbot is designed to answer user queries related to parking locations and availability.  The AI Chatbot, powered by RAG, Open Ai LLM API, and LLM prompts, provides natural language processing capabilities, enhancing user interactions and answering parking-related queries.

To explore the AI chatbot feature, interact with the chat interface in the application and ask questions about parking locations.

## Technology Stack

- React Native
- Expo
- Node.js
- Express.js
- SQLite
- JavaScript
