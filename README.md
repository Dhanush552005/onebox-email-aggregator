# 📧 Onebox Email Aggregator – Assignment Submission  
### _Real-time IMAP Sync • Elasticsearch Search • AI Categorization • Slack/Webhooks • Frontend UI • RAG Replies_

---

# 🚀 Overview

This project is a full-stack **Onebox Email Aggregator**, similar to ReachInbox.  
It synchronizes IMAP accounts in real time, stores emails in Elasticsearch,  
categorizes them using AI, notifies Slack/webhooks, and provides a React UI.

This repository was created as part of the assignment.

---

# ✨ Features Implemented

### 📨 1. Real-Time Email Synchronization
- Sync multiple IMAP accounts  
- Persistent IMAP IDLE mode (no cron jobs)  
- Fetch last 30 days  
- Auto-parsing + categorization  

### 🔍 2. Elasticsearch Search Engine
- Emails stored & indexed  
- Full-text search on:
  - subject  
  - from  
  - body  
- Filters by:
  - folder  
  - account  

### 🤖 3. AI Email Categorization (Gemini)
Labels:
- Interested  
- Meeting Booked  
- Not Interested  
- Spam  
- Out of Office  

### 🔔 4. Slack & Webhook Notifications
- Slack message when email category = “Interested”  
- Webhook trigger (webhook.site)

### 🖥️ 5. Frontend (React)
- Email list  
- Email viewer  
- Search  
- Filters  
- Category display  

### 🧠 6. RAG Suggested Replies (Optional)
- Embeddings generated using Gemini  
- Stored in Pinecone  
- Retrieved for suggested responses  

---

# 🏗️ Architecture


---

# ⚙️ Tech Stack

### Backend
- Node.js (CommonJS)
- Express
- IMAPFlow
- Elasticsearch JS client
- Gemini API
- Pinecone (optional)
- dotenv

### Frontend
- React  
- Axios  

### Infrastructure
- Docker (Elasticsearch + Kibana)

---

# 📦 Setup Instructions

## 1️⃣ Clone the repository

```bash
git clone https://github.com/onebox-email-aggregator.git
cd onebox-email-aggregator
