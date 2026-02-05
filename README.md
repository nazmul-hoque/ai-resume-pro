# AI Resume Pro

AI Resume Pro is a modern, AI-powered resume builder designed to help job seekers create professional, ATS-friendly resumes in minutes. Built with a focus on ease of use, sleek design, and powerful AI integrations.

## 🚀 Features

- **Split-Screen Builder**: Real-time preview as you edit your resume.
- **AI Suggestions**: Get professional suggestions for your summary, work experience, and skills powered by AI.
- **ATS-Friendly Templates**: Choose from a variety of professionally designed, ATS-optimized templates.
- **PDF Export**: Export your resume to a high-quality PDF format.
- **Persistent Storage**: Save your resumes to your account and access them from anywhere.
- **Google Authentication**: Quick and secure sign-in with Google.

## 🛠️ Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **PDF Generation**: [jspdf](https://github.com/parallax/jsPDF), [html2canvas](https://html2canvas.hertzen.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   cd ai-resume-pro
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
