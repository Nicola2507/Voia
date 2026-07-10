# Moving Voia to your laptop (no USB needed)

You'll move it over the internet using **GitHub** (where your project already lives:
`https://github.com/Nicola2507/Voia`). A fresh install on the laptop should also
clear the dev-server errors, since those came from OneDrive syncing `node_modules`.

---

## 1. Install these on the laptop
You already have **VS Code**. Add:

1. **Node.js** — the **LTS** version (v22 or newer). Download from **https://nodejs.org**
   (the big "LTS" button). This gives you `node` and `npm`.
2. **Git** — download from **https://git-scm.com/download/win** and install with the
   default options.

Then **restart VS Code** so it sees them. To check they worked, open a terminal in
VS Code (top menu **Terminal → New Terminal**) and type:
```
node -v
git --version
```
Both should print a version number.

> Nothing else to install. Supabase, Netlify, and Gemini are online services — you
> just log into them in the browser. All the code libraries install automatically in step 4.

---

## 2. On your CURRENT PC — save everything to GitHub first
So nothing is lost in the move:

1. In VS Code, click the **Source Control** icon on the left (looks like a branch / has a number badge).
2. Click the **+** next to "Changes" to stage everything (or hover "Changes" → "Stage All Changes").
3. Type a message like `save before laptop move` in the box, click **✓ Commit**.
4. Click **Sync Changes** (or the "↑" push button). If it asks, **sign in to GitHub**.

That uploads your latest work.

---

## 3. On the LAPTOP — get the project
1. Open VS Code → **Terminal → New Terminal**.
2. Go to a normal folder (NOT inside OneDrive) and download the project:
   ```
   cd %USERPROFILE%\Documents
   git clone https://github.com/Nicola2507/Voia.git
   cd Voia
   ```
   (If it asks you to sign in to GitHub, do it.)
3. Open the folder in VS Code: **File → Open Folder →** the new `Voia` folder.

---

## 4. On the LAPTOP — set up the secret file (.env)
Your passwords/keys are **not** stored on GitHub (for safety), so recreate them:

1. On your **current PC**, open the project's **`.env`** file in VS Code and copy all 3 lines.
2. On the **laptop**, in the `Voia` folder, create a **new file** named exactly **`.env`**
   (VS Code: right-click in the file list → New File → type `.env`).
3. Paste the 3 lines. It should look like this (with your real values):
   ```
   PUBLIC_SUPABASE_URL=...your value...
   PUBLIC_SUPABASE_ANON_KEY=...your value...
   GEMINI_API_KEY=...your value...
   ```
4. Save the file.

---

## 5. On the LAPTOP — install and run
In the VS Code terminal (inside the `Voia` folder):
```
npm install
npm run dev
```
Wait for it to print a `localhost:4321` line, then open **http://localhost:4321** in your browser.

That's it — you're running on the laptop. 🎉

---

## Easier alternative (if GitHub feels like too much): OneDrive
Your project already sits in OneDrive, so if you **sign into the same Microsoft account**
on the laptop, the whole folder (including the `.env` secrets) will sync over by itself —
no GitHub steps.

**But** it also drags the giant `node_modules` folder, which is what caused your current
problems. If you use this route, once it finishes syncing:
1. Move/copy the `Voia` folder OUT of OneDrive (e.g. into `Documents`).
2. Delete the `node_modules` folder inside it.
3. Run `npm install` then `npm run dev`.

GitHub (steps 1–5 above) is the cleaner option and keeps both machines in sync going forward.
