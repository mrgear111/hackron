# HACKRON - 24-Hour Hackathon Platform

A cyberpunk-themed hackathon management platform for NST 24-hour coding competition.

![Hackron Banner](public/hackron-banner.png)


## 🚀 Features

### For Teams
- **Team Registration & Login**
  - Secure authentication system
  - Team dashboard access
  - Real-time project submission

### For Admins
- **Admin Control Panel**
  - Secure admin registration with special key
  - Team management & oversight
  - Submission tracking

### Event Details
- 24-Hour Non-Stop Coding
- Date: 5th March
- Venue: Lab 1 & 2
- Eligible: UG Students
- Prize Pool: 80k

## 💻 Tech Stack
- Next.js 14 (App Router)
- Firebase (Auth & Realtime DB)
- Tailwind CSS
- Framer Motion
- TypeScript

## 🛠️ Setup

1. **Clone & Install**
```bash
git clone [your-repo-url]
cd hackron
npm install
```

2. **Environment Setup**
Create `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

3. **Run Development Server**
```bash
npm run dev
```

## 📱 Key Pages

- `/` - Landing page with event details
- `/register` - Team registration
- `/team-dashboard` - Project submission portal
- `/admin-dashboard` - Admin control panel

## 🔐 Authentication Flows

### Team Registration
1. Register with team name & email
2. Access team dashboard
3. Submit project details

### Admin Access
1. Register with admin key
2. Access admin dashboard
3. Manage teams & submissions

## 🎨 UI Features

- Cyberpunk-themed design
- Animated components
- Responsive layout
- Terminal-style interface

## 📅 Event Timeline

- 07:00 AM - Participant Reporting
- 08:30 AM - Briefing Session
- 09:00 AM - Hackathon Begins
- 09:30 PM - Security Check

## 📊 Judging Criteria

- Problem Statement
- Approach & Implementation
- Solution Analysis
- Presentation
- Innovation

## 📝 License

MIT License - feel free to use and modify!

---
Built with love for NST's Hackathon
