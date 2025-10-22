<!-- # Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
 -->


Digital Payment Demo App
Overview

This is a React Native/Expo app that simulates a digital payment workflow. Users can Sign Up/Login, save bank and card details, view them, and simulate a demo payment. The goal was to learn Firebase Auth, Firestore, and basic app navigation.

Tech Stack

React Native + Expo – for mobile app development

Firebase Auth – email/password authentication

Firestore – store user bank & card details

AsyncStorage – persist login state

Setup Instructions

Clone the repo:

git clone <repo-link>
cd <project-folder>


Install dependencies:

npm install


Configure Firebase:

Create a project in Firebase Console

Enable Email/Password authentication

Add your Firebase config in Firebaseconfig.js

Run the app:

npx expo start

App Flow

Sign Up/Login Page – register or login with email & password.

Bank Page – save account number and card details (name, number, expiry, CVV).

View Payment Details Page – see saved details in read-only mode (card shows only last 4 digits).

Confirm Payment Page – validates stored info and simulates a successful payment.

Firestore Structure

Collection: users

Document ID: user.uid

Fields:

{
  "accountNumber": "123456789",
  "cardDetails": {
    "name": "Dhanush",
    "cardNumber": "1234567890123456",
    "expiry": "12/35",
    "cv": "321"
  }
}

API / Database Endpoints

Auth

Auth.createUserWithEmailAndPassword(email, password) → Sign Up

Auth.signInWithEmailAndPassword(email, password) → Login

Firestore

setDoc(doc(db, "users", user.uid), {...}) → Save/update account or card details

getDoc(doc(db, "users", user.uid)) → Fetch account or card details

Notes

Account number, card number, and CVV are stored as strings to avoid precision issues.

Navigation is handled with Expo Router.

This app is for demo purposes only, no real payments are processed.