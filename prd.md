# AI Resume Pro - Product Requirements Document (PRD)

## Project Overview
AI Resume Pro is a professional-grade, AI-powered resume builder designed to help users create, optimize, and tailor resumes for modern recruitment systems (ATS). The application features a sleek, professional split-screen interface with real-time preview and a suite of intelligent career tools.

## Core Features

### 1. Unified Resume Builder
- **Split-Screen Interface**: Real-time synchronization between the editor and professional PDF preview.
- **Section Management**: Reorderable sections (Personal Info, Summary, Experience, Education, Skills) via drag-and-drop.
- **Auto-Save**: Seamless persistence of resume data using Supabase.

### 2. Intelligent AI Features
- **Auto-Import (PDF Parsing)**: Users can jumpstart their resume by uploading an existing PDF. The system extracts text and structures it into the application's format.
- **Smart Achievement Builder**: A guided tool using the **STAR Method** (Situation, Task, Action, Result) to craft high-impact bullet points.
- **AI Improvement Hub**: Dedicated "AI Enhance" buttons for professional summaries and skills list optimization.
- **Cover Letter Generator**: Instantly drafts highly tailored, formal cover letters based on specific job descriptions and resume data.

### 3. Optimization & Targeting
- **Job Match Analysis**: Real-time score (0-100) comparing the resume against a target job description.
- **ATS Health Check**: Automated audit for common ATS pitfalls (keyword density, formatting, section presence).
- **Multi-Version Management**: Instant duplication of resumes to manage different versions for diverse job targets.

## Technical Architecture

### Frontend
- **Framework**: React + Vite + TypeScript.
- **Styling**: Tailwind CSS + ShadcnUI (Premium theme: HSL tailored Slate & Navy).
- **State Management**: React-Hook-Form for complex form state and validation.
- **Data Fetching**: TanStack Query for efficient server state and invalidation.

### Backend & AI
- **Infrastructure**: Supabase (Database, Auth, Edge Functions).
- **AI Engine**: Gemini 1.5 Flash via Lovable AI Gateway.
- **Architecture**: Modular Edge Functions with a centralized `ai-suggest` hub for all intelligent features.
- **Modularity**: Centralized `aiService` on the frontend with reusable components like `AiEnhanceButton`.

## Design Direction
- **Typography**: Clean, professional hierarchy using Inter/Sans-serif.
- **Aesthetics**: Glassmorphism accents, subtle micro-animations, and card-based layouts for a premium feel.
- **UX**: Header-driven tool access to maintain focus on content during the writing process.