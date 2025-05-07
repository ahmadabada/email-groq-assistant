Here’s a clean and informative `README.md` for your project:

---

### 📁 `README.md`

```markdown
# 📧 Email Groq Assistant

A lightweight offline-first project that fetches your emails, stores them locally, and allows you to ask questions about them using a local AI assistant powered by Groq and the Mixtral model.

## 🔧 Features

- Fetches emails from your IMAP inbox and saves them locally.
- Deduplicates emails using content hashing.
- Stores emails in plain text for transparency and speed.
- Allows natural language Q&A over your emails via a small frontend UI.
- Uses Groq Cloud for blazing-fast Mixtral model inference.

## 📂 Project Structure

```

src/
├── index.ts              # Fetch and store emails
├── server.ts             # Serve a chat interface and connect to Groq
├── utils/
│   ├── fileUtils.ts      # Read/write files
│   └── hashUtils.ts      # Email hashing
public/
└── index.html            # Frontend UI for querying your emails

````

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
````

### 2. Set up environment

Create a `.env` file:

```
GROQ_API_KEY=your_groq_api_key
IMAP_USER=your_email@example.com
IMAP_PASSWORD=your_password
IMAP_HOST=imap.example.com
IMAP_PORT=993
```

### 3. Fetch emails

```bash
npx ts-node src/index.ts
```

### 4. Start the server

```bash
npx ts-node src/server.ts
```

Then open `http://localhost:3001` in your browser.

---

## 🤖 Models Used

* **Groq + Mixtral** — An ultra-fast Mixture-of-Experts model with excellent reasoning ability.
