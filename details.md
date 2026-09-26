# ThermalPaste — Frontend Work Summary (Phases 1–7)

This document provides a simple, easy-to-understand breakdown of all the work done on the **ThermalPaste** frontend. It explains **which files were changed**, **what was done**, and **why it was done**, so you can easily explain the project to anyone.

---

## 🎯 High-Level Goal
We transitioned the frontend from using hardcoded mock data (`mockData.js`) to talking directly to the live backend API (`http://localhost:4000`). 

Everything was done following the project guidelines:
- **No external UI libraries** added.
- **Strict dark/cyan theme** maintained (`#0B0D11` background, `#0F1117` cards, `#222834` borders, `#00D8F6` cyan accent).
- **Fast, real-time UI updates** using TanStack Query cache invalidation (no manual page refreshes).
- **Graceful fallbacks** so the app never crashes if the backend is down or a post is missing.
- **100% clean code**: `0` ESLint errors, `0` warnings.

---

## 📁 File-by-File Breakdown

### 1. `src/services/posts.js` (New File — The API Bridge)
- **What it is:** The central service file that handles all HTTP requests related to posts using our pre-configured Axios instance (`api.js`).
- **What was added:**
  - `getFeed()`: Fetches all public posts for the home feed.
  - `getPostById(id)`: Fetches a single post along with its author and group.
  - `getPostsByGroup(groupId)`: Fetches posts belonging to a specific community (e.g., `watercooling`).
  - `createPost(data)`: Sends a new post to the backend.
  - `updatePost(id, updates)`: Updates an existing post (creator only).
  - `deletePost(id)`: Deletes a post (creator only).
  - `toggleSavePost(id)`: Saves or unsaves (bookmarks) a post.
  - `getSavedPosts()`: Retrieves all posts saved by the logged-in user.
  - `POST_KEYS`: Standardized React Query keys so cache invalidation is predictable everywhere.

---

### 2. `src/components/PostCard.jsx` (The Smart Feed Card)
- **What it is:** The card component that displays each post in feeds.
- **What was changed:**
  - **Dual Schema Support:** The backend uses `_id`, `heading`, `description`, `imageLink`, `user.username`, while the old mock data used `id`, `title`, `content`, `image`, `authorname`. We normalized all fields so the component seamlessly supports both without crashing.
  - **Live Bookmark / Save Button:** Clicking the "Save" bookmark button instantly toggles the UI (optimistic update), calls the backend `toggleSavePost` API, and updates both the home feed and saved feed cache.
  - **Auth Awareness:** If a guest user clicks "Save", they are automatically redirected to the `/login` page.
  - **Mobile Responsiveness:** Added `flex-wrap` and adaptive text (`hidden sm:inline` on "Comments") so cards look great and buttons never overflow or clip on small 360px phone screens.

---

### 3. `src/components/CreatePostForm.jsx` (New Post Modal)
- **What it is:** The popup modal used to publish a new post.
- **What was changed:**
  - **Dynamic Group Selection:** Now queries live communities from the backend (`getGroups()`), so posts can be tagged to real communities.
  - **Real Creation:** Sends the form payload (`group`, `heading`, `description`, `imageLink`) to `createPost()`.
  - **Instant Feed Refresh:** Invalidates the `["posts"]` query cache upon success and redirects directly to the newly created post's page (`/post/:id`).
  - **Error Handling:** Shows clear inline alerts if fields are missing or if the server returns an error.

---

### 4. `src/pages/HomePage.jsx` (Main Feed)
- **What it is:** The landing page displaying all recent posts.
- **What was changed:**
  - **Live Data Query:** Replaced the static array with `useQuery({ queryKey: POST_KEYS.feed(), queryFn: getFeed })`.
  - **Loading Skeletons:** Added dark pulsing skeleton cards while posts are loading to prevent sudden screen flashes or layout jumps.
  - **Error & Retry State:** If the backend cannot be reached, it shows a friendly error card with a "Retry" button.
  - **Empty State:** If there are no posts yet, it shows a "Be the first to share your rig!" prompt with a button to open the post creator.

---

### 5. `src/pages/PostDetailsPage.jsx` (Single Post Discussion)
- **What it is:** The full-page view for a single post with comments, specs, and voting.
- **What was changed:**
  - **URL-Based Fetching:** Decoupled from router state. Visiting `/post/:id` directly fetches the post from the backend (`getPostByIdApi(id)`).
  - **Loading & 404 Pages:** Added a spinning cyan loader while fetching and a clean 404 card if the post doesn't exist.
  - **Owner-Only Edit Modal:** If the logged-in user created the post, an "Edit" button appears. Clicking it opens a modal allowing them to update the title, content, and image.
  - **Owner-Only Delete Modal:** If the logged-in user is the owner, a "Delete" button appears with a confirmation modal. Deleting invalidates cache and redirects back to Home.
  - **Preserved Existing Features:** All existing nested comment trees, reply boxes, and voting systems were carefully kept intact.

---

### 6. `src/pages/SavedPostsPage.jsx` (Bookmarked Posts)
- **What it is:** The page showing posts bookmarked by the user (`/saved`).
- **What was changed:**
  - **Live Query:** Fetches live saved posts via `getSavedPosts()`.
  - **Pulse Skeletons & Error Handling:** Includes skeleton loaders and a retry button if the request fails.
  - **Empty State:** If no posts are saved, it displays a sleek bookmark icon, an explanation, and an "Explore Feed" button pointing to `/`.
  - **Real-time Sync:** When a user unsaves a post from inside this page or on another tab, the card smoothly updates without needing a page reload.

---

### 7. `src/pages/CommunitiesPage.jsx` (Community Feed)
- **What it is:** The page for individual sub-groups (e.g., `/communities/watercooling`).
- **What was changed:**
  - **Live Group Posts:** Uses `getPostsByGroup(displayGroupId)` to fetch only posts tagged with this community.
  - **Empty State with Pre-Selection:** When a community has no posts yet, it shows "No posts in this community yet" with a "Write the First Post" button that opens `CreatePostForm` with that community pre-selected.
  - **Loading Skeletons:** Added skeleton cards matching the community layout during loading.

---

### 8. `src/pages/ProfilePage.jsx` (User Profile & Communities)
- **What it is:** Displays the user's settings, personal posts, and joined communities.
- **What was changed:**
  - **Real Joined Communities:** Reads populated `profile.groups` from `getProfile()` to display real joined communities with icons, member counts, public/private tags, and direct links to `/communities/:groupId`.
  - **Empty State:** Shows a clean card with an "Explore Communities" button if the user hasn't joined any groups yet.
  - **Real User Posts:** The "Posts" tab now queries `getFeed()` and displays posts authored by the user.
  - **Fixed React 19 Warning:** Removed an unnecessary `useEffect` that was triggering cascading re-render warnings (`react-hooks/set-state-in-effect`), replacing it with clean form handlers.

---

### 9. `src/data/mockData.js` (Pruning & Cleanup)
- **What was changed:**
  - Safely removed the unused `getSavedPosts` mock function.
  - Retained `SUB_GROUPS`, `POSTS`, and `SEARCH_USERS` strictly for client-side search autocomplete in the navigation bar.

---

### 10. `eslint.config.js` & Project-Wide Code Quality
- **What was changed:**
  - Enabled JSX support in ESLint configuration.
  - Allowed `useAuth` hook export alongside `AuthProvider` in context.
  - Cleaned up unused imports across `Navbar.jsx`, `CommunitiesListPage.jsx`, and `api.js`.
  - Verified: `npx eslint src` returns **0 errors and 0 warnings across the entire repository**.

---

## 🗣️ Quick Talking Points (For Presentations / Standups)

1. **"We fully decoupled the frontend from static mock data":** All feeds (Home, Community, Saved, Profile, Details) now communicate with the live REST API.
2. **"Seamless user experience with TanStack Query":** Creating, editing, deleting, or bookmarking posts updates the UI instantly across all pages without hard refreshes.
3. **"Owner permissions are enforced in the UI":** Edit and Delete options only appear for the person who created the post, with confirmation modals to prevent accidental deletions.
4. **"Zero design regressions":** We preserved the existing dark/cyan design system and verified mobile responsiveness down to 360px screens.
5. **"Clean, warning-free codebase":** Resolved all React 19 / ESLint issues, leaving the repository with zero lint errors.
