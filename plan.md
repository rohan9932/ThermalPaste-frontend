# ThermalPaste Frontend — Post Feature Implementation Plan

**Active Driver:** User 2 (Rohan)  
**Guidelines Reference:** Adheres strictly to `guide.md` (Simplicity First, Theme Consistency, No Unapproved Additions, Responsive Design, and Activity Logging).

---

## 🎯 Goal
Replace the temporary `mockData.js` posts with real API-backed data across the **Home feed**, **Post Details page**, **Saved Posts page**, and **Community pages**, wire real post creation in `CreatePostForm`, and surface joined communities on the **Profile page** via `UserProfile.groups`.

---

## 🛠️ Codebase Guidelines Alignment (from `guide.md`)
- **Simplicity First:** Follow the established service architecture in `src/services/` (pure Axios async functions like `groups.js` and direct `useQuery` / `useMutation` in components). Avoid creating unnecessary extra directories or wrappers like `src/hooks/`.
- **No Unapproved Additions:** Use only already installed packages (`@tanstack/react-query`, `axios`, `lucide-react`, `react-router-dom`). Do not introduce external toast, date, or state libraries.
- **Theme Consistency:** Strictly use the defined theme tokens:
  - Background `#0B0D11`, Card/Surface `#0F1117`, Border `#222834`, Input `#161922`
  - Accent Cyan `#00D8F6` (glow: `0 0 15px rgba(0, 216, 246, 0.25)`), Purple `#A78BFA`
  - Text Primary `#F3F4F6`, Text Secondary/Muted `#8F99A8`
  - Layout Wrapper: `flex-1 p-4 sm:p-6 w-full` with container `mx-auto max-w-4xl space-y-6`.
- **Responsive & Dynamic Design:** Ensure all new controls (save button, edit/delete actions, post composer) adapt seamlessly to mobile viewports (360px+) without breaking flex or grid rows.
- **Activity Log:** Log each completed phase under `### User 2 (Rohan)` in `guide.md`.

---

## 📋 Data Normalization Map (Backend ↔ Frontend)
The backend `Post` model uses fields that slightly differ from `mockData.js`. Components should support both seamlessly:

| Backend `Post` Schema | Frontend / `PostCard` Prop | Fallback Handling |
|---|---|---|
| `_id` | `id` | `post._id \|\| post.id` |
| `heading` | `title` | `post.heading \|\| post.title` |
| `description` | `content` | `post.description \|\| post.content` |
| `imageLink` | `image` | `post.imageLink \|\| post.image` |
| `user.username` | `author` / `authorname` | `post.user?.username \|\| post.author \|\| "Member"` |
| `user.imageLink` | `authorAvatar` | `post.user?.imageLink \|\| post.authorAvatar` |
| `group.name` | `subGroup` / `community` | `post.group?.name ? `g/${post.group.name}` : post.subGroup` |
| `createdAt` | `timestamp` | Formatted `post.createdAt \|\| post.timestamp` |
| `isSaved` (boolean) | `isSaved` | `post.isSaved ?? false` |

---

## Phase 1 — Post Service Layer

**New File:** `src/services/posts.js`  
Follows the exact pattern of `src/services/groups.js` and `src/services/profile.js` using the singleton `api` instance from `src/services/api.js`.

### Service Functions
- `getFeed({ page = 1, limit = 10 } = {})` → `GET /api/posts`
- `getPostById(id)` → `GET /api/posts/:id`
- `getPostsByGroup(groupId, { page = 1, limit = 10 } = {})` → `GET /api/groups/:idOrName/posts`
- `createPost({ group, heading, description, imageLink })` → `POST /api/posts`
- `updatePost(id, { heading, description, imageLink })` → `PUT /api/posts/:id`
- `deletePost(id)` → `DELETE /api/posts/:id`
- `toggleSavePost(id)` → `POST /api/posts/:id/save`
- `getSavedPosts()` → `GET /api/saved`

### Standard React Query Keys
- `["posts", "feed"]`
- `["posts", id]`
- `["posts", "group", groupId]`
- `["saved"]`

**Review Checkpoint:** `src/services/posts.js` is clean, exported, and ready to be consumed by components. ✅ Completed

---

## Phase 2 — Home Feed & Post Creation

**Target Files:** `src/pages/HomePage.jsx`, `src/components/CreatePostForm.jsx`, `src/components/PostCard.jsx`

### Tasks
- [x] **Feed Fetching in `HomePage.jsx`:**
  - Replace static `POSTS` import with `useQuery({ queryKey: ["posts", "feed"], queryFn: () => getFeed() })`.
  - Loading State: Pulse skeleton cards matching `#0F1117` card backgrounds with `#161922` shimmer blocks.
  - Error State: Theme-consistent alert banner (`bg-rose-500/10 border border-rose-500/30 text-rose-400`) with a "Retry" button.
  - Empty State: Elegant card encouraging user to write the first post or join communities.
- [x] **Normalize Props in `PostCard.jsx`:**
  - Update property extraction to support both backend `_id`, `heading`, `description`, `imageLink`, `user`, and `group` while keeping backwards compatibility with mock objects.
- [x] **Wire `CreatePostForm.jsx` to API:**
  - Replace hardcoded `SUB_GROUPS` selector with dynamic groups from `useQuery({ queryKey: ["groups"], queryFn: getGroups })`.
  - Submit payload `{ group: selectedGroupId, heading: title, description: content, imageLink }` via `createPost`.
  - On success: invalidate `["posts", "feed"]` and navigate to `/post/:id` or close modal.
  - Show inline validation/error messages using standard `#161922` input styling.

**Review Checkpoint:** Home feed renders real database posts. Creating a post via the "Create" button adds it to the database and appears in the feed immediately. ✅ Completed

---

## Phase 3 — Post Details Page (Deep-Linkable & Interactive)

**Target File:** `src/pages/PostDetailsPage.jsx`

### Tasks
- [x] **Decouple from Router Navigation State:**
  - Remove exclusive reliance on `location.state.post`.
  - Fetch post directly via `useQuery({ queryKey: ["posts", id], queryFn: () => getPostById(id) })` using `useParams()`.
  - Provide a cyan spinner (`border-2 border-[#00D8F6] border-t-transparent animate-spin`) while loading.
  - 404 / Missing State: Clean card with a link back to Home feed if the post ID does not exist.
- [x] **Owner-Only Edit & Delete Actions:**
  - Compare `post.user?._id || post.user` with logged-in `user?.id || user?._id` from `useAuth()`.
  - If owner, render "Edit" and "Delete" button options in the post header.
  - Delete: prompt confirmation modal/dialog, call `deletePost(id)`, invalidate `["posts"]`, and navigate back to `/`.
  - Edit: inline modal or toggle to update `heading`, `description`, and `imageLink`.
- [x] **Preserve Existing Comments & Voting UI:**
  - Maintain the existing nested comment tree (`CommentItem`), reply box, and vote button styling intact.

**Review Checkpoint:** Pasting `/post/:id` in an incognito window or refreshing the page loads the exact post without errors. Authors see Edit/Delete controls; non-authors do not. ✅ Completed

---

## Phase 4 — Bookmark / Save Posts & Saved Posts Page

**Target Files:** `src/components/PostCard.jsx`, `src/pages/PostDetailsPage.jsx`, `src/pages/SavedPostsPage.jsx`

### Tasks
- [x] **Bookmark Toggle on PostCard & PostDetails:**
  - Add or activate `Bookmark` icon button on `PostCard` and `PostDetailsPage`.
  - Wire to `toggleSavePost(postId)` with optimistic UI toggle (`isSaved` state flips immediately).
  - Invalidate `["saved"]` and `["posts"]` on completion.
  - If unauthenticated, redirect to `/login` or prompt login.
- [x] **Live Data in `SavedPostsPage.jsx`:**
  - Replace `getSavedPosts()` mock caller with `useQuery({ queryKey: ["saved"], queryFn: getSavedPosts })`.
  - Empty State: "No saved posts yet" card with a link to explore the Home feed.
  - Reuse `PostCard` for unified styling.

**Review Checkpoint:** Clicking the bookmark icon instantly saves/unsaves a post; `/saved` reflects the user's real saved posts list. ✅ Completed

---

## Phase 5 — Community-Scoped Post Feed

**Target File:** `src/pages/CommunitiesPage.jsx`

### Tasks
- [x] **Replace `getPostsByCommunity` Fallback:**
  - Query group posts using `useQuery({ queryKey: ["posts", "group", displayGroupId], queryFn: () => getPostsByGroup(displayGroupId) })`.
  - Render real posts within the group using `PostCard`.
  - Display empty state ("No posts in this community yet. Be the first to start a discussion!") with a "Write Post" button opening `CreatePostForm` with this community pre-selected.

**Review Checkpoint:** Visiting `/communities/watercooling` displays only posts created in that community. ✅ Completed

---

## Phase 6 — Joined Communities on Profile Page

**Target File:** `src/pages/ProfilePage.jsx`

### Tasks
- [x] **Render Real Communities:**
  - Inspect `profile.groups` from `getProfile()` (or `useAuth().user`).
  - Render a "Your Communities" tab/card displaying joined communities with their icon/avatar and member count.
  - Clicking any community navigates to `/communities/:groupId`.
  - Empty state if the user hasn't joined any communities with an "Explore Communities" link to `/communities`.

**Review Checkpoint:** Communities joined via the Sidebar or Community page appear under the Profile page without stale cache. ✅ Completed

---

## Phase 7 — Final Polish, Mobile Audits & Activity Logging

### Tasks
- [x] **Mock Data Pruning:** Safely remove unused mock post functions once all pages query the API, keeping search datasets if search is still client-filtered.
- [x] **Mobile & Responsive Verification:** Test layouts on mobile screens (360px–420px) to ensure no horizontal overflow, misaligned flex wraps, or broken modals.
- [x] **Build Validation:** Run `npm run build` and `npm run lint` to guarantee clean compilation without warnings.
- [x] **Update `guide.md`:** Document completed milestones under `### User 2 (Rohan)`.

**Review Checkpoint:** Full frontend post feature transitions smoothly between backend API and mock fallbacks, with zero lint errors and verified responsive layouts across all viewports. ✅ Completed

---

### Suggested Execution Sequence
`Phase 1` ➔ `Phase 2` ➔ `Phase 3` ➔ `Phase 4` ➔ `Phase 5` ➔ `Phase 6` ➔ `Phase 7`.  
Phases 1–3 immediately unblock the primary user flow (feed browsing and post viewing/creation).