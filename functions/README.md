# Birb - NestJS API & Firebase Triggers

The backend component of **Birb**, structured as a NestJS application wrapped as a single HTTPS Cloud Function, accompanied by standalone Firestore Cloud Function Triggers.

---

## 🛠️ Tech Stack & Architecture

*   **Framework**: NestJS (API controller layers, services, pipes, and auth guards)
*   **Hosting Env**: Node.js 18+ inside Firebase Cloud Functions (v2 HTTPS & v1/v2 DB Triggers)
*   **Database**: Cloud Firestore (NoSQL) using `firebase-admin`
*   **Storage**: Firebase Cloud Storage for profile avatars and attachment assets
*   **Validation**: NestJS validation pipes utilizing `class-validator` and DTOs

---

## 📂 Project Architecture

```text
functions/src/
├── common/           # Custom exception filters and middleware configurations
├── main.ts           # Entry point. Configures NestJS CORS options and exports Cloud Functions
├── modules/          # NestJS Business Logic Modules
│   ├── auth/         # Token validation, phone registration check endpoint (/auth/check-phone), and auth guards utilizing Firebase Admin SDK
│   ├── comments/     # Comments management and thread nesting services
│   ├── firebase/     # Shared module providing database connection instances
│   ├── likes/        # Like/Dislike action controllers and operations
│   ├── posts/        # Post CRUD, validation DTOs, and likes interactions
│   └── users/        # User profile retrieval and management
├── triggers/         # Standalone Database and Auth Cloud Functions Triggers
│   ├── comment.trigger.ts # Increments/decrements reply counts when replies are created/deleted
│   ├── like.trigger.ts    # Re-calculates and caches like counters on posts when liked/disliked
│   ├── post.trigger.ts    # Cascades deletion to likes, comments, and media when posts are deleted
│   └── user.trigger.ts    # Anonymizes user content and deletes profile documents upon auth deletion
└── types/            # TypeScript definitions and custom decorators
```

---

## ⚙️ Backend Environment Variables

Configure `.env` inside `functions/`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5000,https://your-project-id.web.app
```

*   **`ALLOWED_ORIGINS`**: A comma-separated list of browser domains allowed to make CORS requests to the API endpoints.

---

## 🏃 Run Commands

Install the dependencies:
```bash
npm install
```

### Build Code
Transpiles the NestJS TypeScript code into the `dist/` directory, which is required prior to starting the emulator or deploying:
```bash
npm run build
```

### Watch Code
Runs compilation in watch mode for development:
```bash
npm run watch
```

### Linting & Formatting
Runs eslint configuration rules and formatter:
```bash
# Check code style and clear unused imports
npm run lint

# Format code with Prettier
npm run format
```

## ☁️ Deployment

The backend application is deployed from the repository root directory.

> [!IMPORTANT]
> **Priority Order**: Make sure that you deploy Firestore rules, indexes, storage rules, and Realtime Database rules *before* or alongside your Cloud Functions deployment.
> 
> Security rules configure access control for database writes and reads that your functions trigger and authorize.

To build and deploy the backend functions and security configurations:

```bash
# 1. Build the NestJS project first (functions require a compiled output to deploy)
cd functions
npm run build
cd ..

# 2. Deploy rules & indexes
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only database

# 3. Deploy functions (both NestJS API and event triggers)
firebase deploy --only functions
```

