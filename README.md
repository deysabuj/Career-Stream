# Career-Stream
Career Stream — An early-career job aggregation platform that centralizes verified internships and 0–1 YOE opportunities from company career sources, with smart recommendations, advanced search, and direct application through official company portals.
# Career Stream 🚀

### Find your first opportunity. Without the noise.

Career Stream is an early-career job aggregation and discovery platform
designed for students and candidates looking for internships and jobs
requiring 0–1 years of experience.

Instead of forcing users to search across multiple company career pages,
Career Stream centralizes relevant opportunities while keeping the
application process connected directly to the official company source.

---

## ✨ Features

- 🔎 Job search
- 🎯 Early-career focused listings
- 🏢 Company directory
- 📍 Location filtering
- 💼 Work-mode filtering
- 📚 Category filtering
- 🔖 Save jobs
- 👤 User profiles
- 🤖 Personalized recommendations
- 📊 Student dashboard
- 🔗 Direct official application redirects
- 🔄 Automated job synchronization
- 🧹 Job validation and deduplication
- ⏳ Job expiration/reconciliation
- 🛡️ Source security detection
- 📈 Connector monitoring
- 📱 Responsive UI

---

## 🏗️ Architecture

```text
Company Career Sources
        ↓
Connector Engine
        ↓
Zod Validation
        ↓
Experience Filter
        ↓
Normalization
        ↓
Deduplication
        ↓
PostgreSQL
        ↓
REST API
        ↓
React Frontend
        ↓
Student
        ↓
Official Company Application Portal
