# Birb - React, NestJS, and Firebase Twitter Clone

A modern, premium Twitter (X) clone built with a unified full-stack monorepo architecture. It integrates React (Vite) on the frontend and a NestJS API wrapper running on Firebase Cloud Functions, fully supported by Cloud Firestore, Firebase Storage, and Firebase Local Emulators.

---

## 🚀 Key Features

*   **Authentication**: Secure email/password, Google, and Phone (SMS) authentication via Firebase Auth, complete with reCAPTCHA verification, an email verification flow, secure forgot-password requests, and real-time profile syncing.
*   **Profile Security**: Password generation/updates, along with a secure flow to add or update verified phone numbers via OTP codes directly within the user settings.
*   **Microblogging (CRUD)**: Create, edit, and delete posts (tweets) with support for rich text, image attachments, and automatic media cleanup on deletion.
*   **Comments & Replies**: Interactive nested comments and replies system with reactive update counters.
*   **Likes System**: Fast like/dislike actions on posts with reactive counters updated via Firestore Cloud Function triggers.
*   **Search**: Full-page, infinite-loading search powered by Algolia search engine integration.
*   **Rich Media**: Direct avatar and post attachment uploads utilizing Firebase Cloud Storage.
*   **Premium UI/UX**: Designed using TailwindCSS (v4), shadcn/ui components, custom loaders, custom background animations (aurora blobs + dot grid + floating social icons), and smooth page transitions using React Router.

---

## 📂 Project Structure

```text
├── client/                     # React frontend (Vite, TypeScript, TailwindCSS v4)
├── functions/                  # NestJS backend API & Firestore Database triggers
├── extensions/                 # Firebase Algolia Search Extension configuration
├── firestore.rules             # Secure access control rules for Cloud Firestore
├── storage.rules               # Secure access control rules for Cloud Storage
├── database.rules.json         # Realtime Database rules
└── firebase.json               # Firebase CLI project configurations & Emulator settings
```

---

## 🛠️ Local Development & Emulators

This project is configured to run fully local using **Firebase Local Emulator Suite**.

### Emulator Ports Configured:
*   **Emulator UI**: `http://localhost:4000`
*   **Authentication**: Port `9099`
*   **Functions (NestJS API & Triggers)**: Port `5001`
*   **Firestore**: Port `8080`
*   **Storage (Object Bucket)**: Port `9199`
*   **Hosting**: Port `5000`
*   **Database**: Port `9000`

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn
*   Firebase CLI (`npm install -g firebase-tools`)

### 1. Setup Environment Variables

First, set up your configuration in both directories:

#### For React Client:
Copy the example environment file in `client/` and fill in your Firebase and Algolia project details:
```bash
cp client/.env.example client/.env
```
Inside `client/.env`:
*   Set Firebase credentials.
*   Set `VITE_API_BASE_URL` to point to the local functions endpoint: `http://127.0.0.1:5001/<your-project-id>/us-central1/api`.
*   Set Algolia credentials (`VITE_ALGOLIA_APP_ID`, `VITE_ALGOLIA_SEARCH_KEY`).

#### For NestJS Backend:
Copy the example environment file in `functions/` and configure your CORS allowed origins:
```bash
cp functions/.env.example functions/.env
```
Inside `functions/.env`:
*   Configure `ALLOWED_ORIGINS` to specify which domains are allowed to hit the API (e.g. `http://localhost:5173,http://localhost:5000`).

---

### 2. Install Dependencies

Install packages in both `client/` and `functions/`:

```bash
# Install client dependencies
cd client
npm install

# Install backend/functions dependencies
cd ../functions
npm install
```

---

### 3. Run Locally

To spin up the entire application locally with Emulators:

#### Step A: Build the NestJS Functions code
Since Firebase Functions require a build output to run in the emulator:
```bash
cd functions
npm run build
```

#### Step B: Start Firebase Emulators (from root directory)
Run this command at the root directory to launch the auth, storage, database, firestore, and functions emulators:
```bash
firebase emulators:start
```

#### Step C: Start Vite Development Server
In a separate terminal tab, run the client application:
```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧹 Code Quality

Both packages are configured with **ESLint** and **Prettier** along with automatic unused-import cleaning:

```bash
# From client or functions directories:
npm run lint    # Check for lint errors
npm run format  # Format codebase with prettier
```

---

## 🚀 Deployment

To deploy the workspace to Firebase:

1.  Login to your account and select your project:
    ```bash
    firebase login
    firebase use <your-project-id>
    ```
2.  Deploy Firestore rules and indexes:
    ```bash
    firebase deploy --only firestore
    ```
3.  Deploy backend API and Cloud Function triggers:
    ```bash
    firebase deploy --only functions
    ```
4.  Deploy Storage rules:
    ```bash
    firebase deploy --only storage
    ```
5.  Build the client production bundle and deploy static hosting files:
    ```bash
    cd client
    npm run build
    cd ..
    firebase deploy --only hosting
    ```
