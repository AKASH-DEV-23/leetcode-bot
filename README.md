![Node](https://img.shields.io/badge/Node.js-20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Redis](https://img.shields.io/badge/Redis-red)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-black)

# 🚀 LeetCode Daily Question Telegram Bot

A fully automated Telegram bot that fetches the **daily LeetCode problem** and posts it to a Telegram channel with a formatted preview using **Telegraph**.

The bot runs automatically using **GitHub Actions cron jobs** and uses **Redis** to prevent duplicate posts.

---

# ✨ Features

* 📌 Fetches **LeetCode Daily Question**
* 🤖 Sends the problem automatically to a **Telegram channel**
* 📰 Generates a **Telegraph page preview**
* ⚡ Uses **Redis caching** to prevent duplicate posts
* ⏰ Runs automatically using **GitHub Actions**
* 🔁 Retry mechanism for Telegram API failures

---

# 🏗 Architecture

LeetCode API
↓
Node.js Script
↓
Telegraph (formatted article)
↓
Redis (duplicate prevention)
↓
Telegram Bot
↓
Telegram Channel

---

# ⚙️ Tech Stack

* **Node.js**
* **TypeScript**
* **Redis**
* **Telegram Bot API**
* **Telegraph API**
* **GitHub Actions**

---

# 🔑 Environment Variables

Create a `.env` file:

```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
TELEGRAPH_ACCESS_TOKEN=your_telegraph_token
REDIS_URL=your_redis_connection_url
```

---

# 🖥 Local Setup

### 1️⃣ Clone repository

```
git clone https://github.com/AKASH-DEV-23/leetcode-bot.git
cd leetcode-bot
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Run bot locally

```
npx ts-node src/tasks/leetcode/dailyquestion-en.ts
```

---

# 🤖 GitHub Actions Automation

The bot runs automatically every **30 minutes** using GitHub Actions.

Workflow file:

```
.github/workflows/bot.yml
```

Cron configuration:

```
schedule:
  - cron: "*/30 * * * *"
```

---

# 🔐 GitHub Secrets

Add the following secrets in your repository:

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAPH_ACCESS_TOKEN
REDIS_URL
```

Path:

```
Repository → Settings → Secrets → Actions
```

---

# 📬 Telegram Setup

1. Create a bot using **BotFather**
2. Copy the **Bot Token**
3. Add the bot to your Telegram channel
4. Make the bot **admin**
5. Get the **chat_id**

---

# 🧠 How Duplicate Prevention Works

The bot stores the **daily question slug** in Redis.

Example:

```
daily-question:fancy-sequence
```

If the question already exists in Redis, the bot exits.

```
⏳ Already processed. Exiting...
```

---

# 📸 Example Output

Telegram message includes:

* Problem Title
* Difficulty
* Problem Description
* Link to LeetCode
* Telegraph formatted preview

---

# 🚀 Future Improvements

* Multi-language support
* Multiple Telegram channels
* Daily solution posting
* LeetCode contest notifications
* Leaderboard integration

---

# 👨‍💻 Author

**Akash Kumar**

Backend & Cloud Enthusiast
Spring Boot • Express • AWS • Docker • System Design

GitHub: https://github.com/AKASH-DEV-23

---
