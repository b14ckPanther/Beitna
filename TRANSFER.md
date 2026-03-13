# Transferring Beitna to Another PC or Mac

Use these steps to run the project on a new machine (Windows, MacBook, or Linux). The repo is the source of truth; **do not copy `node_modules`** — reinstall on the new machine.

---

## On the new machine

### 1. Clone the repo (if not already copied)

```bash
git clone YOUR_REPO_URL.git
cd beitna-web
```

If you copied the project folder (e.g. via USB or cloud) instead of cloning, just `cd` into the project:

```bash
cd path/to/beitna-web
```

### 2. Remove old dependencies (if present)

If you copied the folder from another PC, delete `node_modules` so you can do a clean install.

**macOS / Linux:**
```bash
rm -rf node_modules
```

**Windows:**  
On Windows, **do not use** `rm -rf` (that’s Unix-only). Use one of these:

**PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

**Command Prompt (cmd):**
```cmd
rmdir /s /q node_modules
```

**If you get “Access denied” or “cannot remove”:**  
The Next.js dev server or another process is locking a file. Do this:

1. Stop the dev server (`Ctrl+C` in the terminal where `npm run dev` is running).
2. Close any other terminals or editors that have the project open.
3. Run the delete command again from a **new** PowerShell or cmd window.

**Still won’t delete on Windows?** Try in this order:

1. **If Cursor/VS Code is open:** The editor often locks `next-swc.*.node`. **Close Cursor completely**, then open **Command Prompt or PowerShell** (right‑click → Run as administrator), `cd` to the project folder.  
   - **In PowerShell** use: `Remove-Item -Recurse -Force node_modules`  
   - **In Command Prompt (cmd)** use: `rmdir /s /q node_modules`  
   (Do not use `rmdir /s /q` in PowerShell — it will error. Use the PowerShell command above.)

2. **Use `rimraf`** (sometimes works if the lock is only from a terminal):
   ```powershell
   npx rimraf node_modules
   ```
   You can run this from the project folder in your current terminal. No need to close Cursor.

3. **Close Cursor completely**, then open **PowerShell** or **Command Prompt** as Administrator (right‑click → “Run as administrator”), `cd` to the project folder, then:
   - **PowerShell:** `Remove-Item -Recurse -Force node_modules`
   - **Command Prompt (cmd):** `rmdir /s /q node_modules`

4. **Last resort – robocopy trick:** In cmd (not PowerShell), from the project folder:
   ```cmd
   mkdir empty_temp
   robocopy empty_temp node_modules /mir
   rmdir empty_temp
   rmdir node_modules
   ```
   This replaces `node_modules` with an empty mirror so the lock is released, then you remove both folders.

### 3. Install dependencies

```bash
npm install
```

### 4. Environment variables

Create `.env.local` from the example and fill in your values (Supabase, admin password, etc.). **Do not commit `.env.local`.**

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your real credentials. If you’re moving from another PC, copy the contents of your existing `.env.local` into this file (the file itself is gitignored and won’t be in the repo).

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Quick reference (copy-paste)

**macOS / Linux:**
```bash
cd beitna-web
rm -rf node_modules
npm install
cp .env.example .env.local   # then edit .env.local
npm run dev
```

**Windows (PowerShell):**  
*(Stop `npm run dev` first if it’s running, then run from a new terminal.)*
```powershell
cd beitna-web
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
Copy-Item .env.example .env.local   # then edit .env.local
npm run dev
```

---

## Optional: generate QR for print

After `npm install` you can generate the premium QR image:

```bash
npm run generate:qr
```

Output: `qr-output/saltana-qr-premium.png`.
