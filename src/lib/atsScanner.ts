import { ResumeData } from "@/types/resume";

export interface AtsCheckResult {
    score: number;
    checks: {
        label: string;
        passed: boolean;
        impact: "high" | "medium" | "low";
        message: string;
    }[];
}

export const atsScanner = {
    scan(data: ResumeData): AtsCheckResult {
        const checks: AtsCheckResult["checks"] = [];
        let score = 100;

        // 1. Contact Info Checks
        const contactInfo = data.personalInfo;
        const hasEmail = !!contactInfo.email?.trim();
        const hasPhone = !!contactInfo.phone?.trim();
        const hasLocation = !!contactInfo.location?.trim();

        if (!hasEmail) {
            score -= 15;
            checks.push({
                label: "Contact Email",
                passed: false,
                impact: "high",
                message: "Missing email address. Recruiters won't be able to reach you.",
            });
        } else {
            checks.push({
                label: "Contact Email",
                passed: true,
                impact: "high",
                message: "Email address found.",
            });
        }

        if (!hasPhone) {
            score -= 10;
            checks.push({
                label: "Phone Number",
                passed: false,
                impact: "medium",
                message: "Missing phone number. Recommended for direct contact.",
            });
        }

        if (!hasLocation) {
            score -= 5;
            checks.push({
                label: "Location",
                passed: false,
                impact: "low",
                message: "Missing location (City, State). Adds context for local roles.",
            });
        }

        // 2. Summary Check
        const hasSummary = !!data.summary?.trim() && data.summary.length > 50;
        if (!hasSummary) {
            score -= 10;
            checks.push({
                label: "Professional Summary",
                passed: false,
                impact: "medium",
                message: "Your summary is too short or missing. Use it to set the narrative.",
            });
        }

        // 3. Experience Depth
        const expCount = data.experience?.length || 0;
        if (expCount === 0) {
            score -= 20;
            checks.push({
                label: "Work Experience",
                passed: false,
                impact: "high",
                message: "No work experience listed. This is a critical section for ATS.",
            });
        } else {
            // Check for quantitative achievements (numbers)
            const hasNumbers = data.experience.some(exp =>
                exp.description?.split('\n').some(line => /\d+/.test(line))
            );

            if (!hasNumbers) {
                score -= 15;
                checks.push({
                    label: "Quantifiable Results",
                    passed: false,
                    impact: "medium",
                    message: "No metrics or numbers found in experience. Add percentages or figures to show impact.",
                });
            }
        }

        // 4. Skills Check
        const skillsCount = data.skills?.length || 0;
        if (skillsCount < 5) {
            score -= 10;
            checks.push({
                label: "Skill Density",
                passed: false,
                impact: "medium",
                message: "Fewer than 5 skills listed. Aim for 8-12 relevant keywords.",
            });
        }

        // 5. Formatting/Length
        const totalWords = JSON.stringify(data).split(/\s+/).length;
        if (totalWords < 200) {
            score -= 10;
            checks.push({
                label: "Resume Length",
                passed: false,
                impact: "medium",
                message: "Your resume seems quite thin. Aim for at least 300-500 words for depth.",
            });
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            checks: checks.sort((a, b) => (a.passed === b.passed ? 0 : a.passed ? 1 : -1)),
        };
    },
};
