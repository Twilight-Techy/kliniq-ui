# 🏥 Self-Hosting the Kliniq UI

Getting the Kliniq frontend live is super quick. We recommend using **Vercel** or **Netlify**.

### 1. Prerequisites
- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- Your deployed **Kliniq API URL** (from Render).

### 2. Deployment Steps
1. Fork this repository to your GitHub.
2. In Vercel, click **Add New** -> **Project**.
3. Import your forked repository.
4. Vercel will automatically detect it's a Next.js project.

### 3. Environment Variables
This is the most important part! In the Vercel project settings, add:
- `NEXT_PUBLIC_API_URL`: The URL of your backend (e.g., `https://kliniq-api.onrender.com/api/v1`).
- `NEXT_PUBLIC_APP_URL`: Your Vercel URL (e.g., `https://kliniq-ui.vercel.app`).

### 4. Connecting to the Backend
Make sure you've added your Vercel URL to the `ALLOWED_ORIGINS` variable in your backend's environment settings. This prevents "CORS" errors that block the two from talking to each other.

### 5. Need help?
If the AI Assistant on the dashboard says it's "having trouble", double-check that your `GOOGLE_API_KEY` in the backend is valid and enabled!

Go save some lives! 🚀
