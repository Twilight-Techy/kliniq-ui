<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
</p>

# 🏥 Kliniq

**AI-Powered Multilingual Healthcare Platform for Nigeria**

> *Breaking language barriers in healthcare through intelligent AI triage, voice-enabled consultations, and seamless patient-clinician communication in English, Hausa, Igbo, and Yoruba.*

---

## 🌍 The Problem

In Nigeria, **60%+ of the population** speaks indigenous languages as their primary language, yet healthcare systems operate predominantly in English. This creates critical barriers:

- 🚫 **Miscommunication** leads to misdiagnosis and treatment delays
- 🏥 **Healthcare is inaccessible** to non-English speakers
- ⏰ **Triage bottlenecks** overwhelm clinicians with routine queries
- 📝 **Medical records** remain incomprehensible to patients

## 💡 The Solution

**Kliniq** is a comprehensive healthcare platform powered by **N-ATLaS** (Nigerian-Adapted Translation and Language System), our custom multilingual AI model fine-tuned for Nigerian languages and medical contexts.

### Key Innovations

- 🤖 **AI-Powered Triage** — Intelligent symptom assessment that speaks your language
- 🎤 **Voice-First Interface** — Record consultations with real-time transcription and translation
- 🏥 **Hospital Linking** — Connect patients with any hospital via simple codes
- 👩‍⚕️ **Dual Dashboard** — Separate interfaces for patients and clinicians (nurses & doctors)
- 📊 **Smart Analytics** — Track health vitals, appointments, and medical history

---

## ✨ Features

### For Patients

| Feature | Description |
|---------|-------------|
| 💬 **AI Health Assistant** | Chat in your preferred language (English, Hausa, Igbo, Yoruba) for symptom assessment |
| 🏥 **Hospital Linking** | Link to multiple healthcare facilities using hospital codes |
| 📅 **Appointment Management** | Request, view, and manage appointments seamlessly |
| 🎙️ **Voice Recordings** | Record and access doctor consultation notes with translations |
| 📈 **Health Vitals** | Track blood pressure, heart rate, temperature, and oxygen levels |
| 📋 **Medical History** | Complete digital record of diagnoses, prescriptions, and test results |

### For Clinicians

| Feature | Description |
|---------|-------------|
| 📊 **Clinician Dashboard** | Comprehensive overview of patients, cases, and performance |
| 🔍 **AI-Assisted Triage** | Review AI assessments with urgency classification |
| 👥 **Patient Management** | Full patient profiles with medical history and vitals |
| ✅ **Appointment Scheduling** | Approve/reject requests and assign doctors dynamically |
| 💬 **Escalated Queries** | Handle complex cases that need human expertise |
| 🏆 **Gamification** | Points and achievements for clinician engagement |

### Platform-Wide

- 🌙 **Dark/Light Mode** — Beautiful UI that adapts to user preferences
- 🔐 **Secure Authentication** — JWT-based auth with role-based access
- 📱 **Responsive Design** — Works flawlessly on mobile, tablet, and desktop
- ⚡ **Real-time Updates** — Live data synchronization across the platform

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **State** | React Context API |
| **Date Handling** | date-fns |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Running [Kliniq API](https://github.com/your-repo/kliniq-api) backend

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/kliniq-ui.git
cd kliniq-ui

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
kliniq-ui/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Patient dashboard
│   ├── clinician/         # Clinician portal
│   └── onboarding/        # User onboarding flow
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui primitives
│   └── ...               # Feature components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API clients
└── styles/               # Global styles
```

---

## 🎯 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | `dayo@test.com` | `Test1234!` |
| Nurse | `ngozi@test.com` | `Test1234!` |
| Doctor | `emeka@test.com` | `Test1234!` |

---

## 🏆 Hackathon Highlights

This project was built for **Awarri Developer Challenge 2025** with a focus on:

1. **Social Impact** — Addressing healthcare inequity in Nigeria
2. **Technical Innovation** — Custom multilingual AI (N-ATLaS)
3. **User Experience** — Beautiful, accessible, voice-first design
4. **Scalability** — Enterprise-ready architecture with role-based access
5. **Real-World Applicability** — Solving actual clinical workflow challenges

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ for Nigerian Healthcare</strong>
</p>
