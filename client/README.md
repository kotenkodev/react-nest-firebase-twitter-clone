# Birb - React & Vite Client Application

The user interface of **Birb**, built on React (Vite) and TailwindCSS v4. It features real-time feed updates, fully responsive custom components, state management using Zustand, and server state management via TanStack React Query.

---

## 🛠️ Core Technologies

*   **Framework**: React 19 + Vite
*   **Styling**: TailwindCSS (v4) + custom utility CSS tokens + custom canvas/SVG animations + Lucide Icons + Radix UI primitives
*   **Authentication**: Multi-method sign-in switcher (Email/Password, Google, Phone SMS with invisible reCAPTCHA verifier) and in-app profile phone/password management
*   **State Management**: Zustand (client UI/auth store)
*   **Data Fetching**: TanStack React Query (v5) for caching, infinite feeds, and automatic key invalidations
*   **Search**: Algolia InstantSearch integration
*   **Routing**: React Router DOM (v7) with support for page animations and location background routing for modal dialogs
*   **Forms**: React Hook Form with Zod schemas for client-side validations

---

## 📂 Project Architecture

```text
client/src/
├── assets/         # App logos and illustrations
├── components/     # UI components (e.g. emoji picker, search bar, inputs, post cards)
│   ├── comment/    # Comments listing, creation, and nesting components
│   ├── post/       # Post layouts, skeletons, and author tags
│   └── ui/         # Base design system components (buttons, dialogs, cards)
├── config/         # Firebase configuration setup
├── hooks/          # Custom hooks and React Query mutations/queries
├── layout/         # Route wrap frames (Default, Main, protected/public)
├── lib/            # Shared utilities (query key constants, class-merger)
├── pages/          # App views (Home, SignIn/SignUp, Post details, Profile, Verify)
├── schemas/        # Zod validation schemas for forms
├── services/       # Network layers (Axios and Firebase core SDKs)
├── store/          # Zustand global states (auth details, dialog states)
├── types/          # Shared TypeScript interfaces
└── utils/          # Formatting tools, payload transformation, and data syncing
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of the `client/` folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Set this to NestJS server (local Emulator or Cloud Functions)
VITE_API_BASE_URL=http://127.0.0.1:5001/your_project_id/us-central1/api

# Algolia Credentials
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key
```

---

## 🏃 Run Commands

Install the dependencies:
```bash
npm install
```

### Development Server
Starts the React app locally (pointing to the emulator backend/prod endpoints based on `.env` settings):
```bash
npm run dev
```

### Production Build
Builds and optimizes the static files to the `dist/` directory:
```bash
npm run build
```

### Linting & Formatting
Enforce code styling rules and clean up unused imports automatically:
```bash
# Check code style rules
npm run lint

# Format code with Prettier
npm run format
```

---

## 🚀 Deployment

The client application is deployed to **Firebase Hosting** from the root workspace directory.

> [!IMPORTANT]
> **Before Deploying the Frontend**:
> Ensure that all Firestore rules, indexes, storage rules, and backend functions are deployed first. The frontend interacts directly with these services, and deploying the client before the database configurations can lead to permission errors or broken feeds.
>
> Refer to the main [README.md](../README.md#2-deploy-database-configuration--security-rules) in the root directory for the complete multi-service deployment priority guide.

To build and deploy only the client hosting:
```bash
# 1. Navigate to the client directory and build the production bundle
cd client
npm run build

# 2. Go back to the root directory
cd ..

# 3. Deploy hosting assets to Firebase
firebase deploy --only hosting
```

