import { ResumeData } from "./resume";

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Withdrawn';

export interface JobApplication {
    id: string;
    user_id: string;
    resume_id: string | null;
    company_name: string;
    job_title: string;
    job_url?: string;
    status: ApplicationStatus;
    resume_snapshot?: ResumeData;
    cover_letter?: string;
    match_score?: number;
    notes?: string;
    applied_at: string;
    created_at: string;
    updated_at: string;
}

export interface CreateApplicationDTO {
    resume_id?: string;
    company_name: string;
    job_title: string;
    job_url?: string;
    status?: ApplicationStatus;
    resume_snapshot?: ResumeData;
    cover_letter?: string;
    match_score?: number;
    notes?: string;
}
