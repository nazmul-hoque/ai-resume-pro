import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeData } from "@/types/resume";
import { applicationService } from "@/services/application.service";
import { Loader2, Briefcase } from "lucide-react";
import { useParams } from "react-router-dom";

interface SaveApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    coverLetter: string;
    resumeData: ResumeData;
}

export const SaveApplicationModal = ({
    isOpen,
    onClose,
    coverLetter,
    resumeData,
}: SaveApplicationModalProps) => {
    const { id: resumeId } = useParams();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        job_title: "",
        job_url: "",
    });

    const handleSave = async () => {
        if (!formData.company_name || !formData.job_title) return;

        setIsSaving(true);
        try {
            await applicationService.createApplication({
                ...formData,
                resume_id: resumeId,
                cover_letter: coverLetter,
                resume_snapshot: resumeData,
                status: "Applied",
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Track this Application
                    </DialogTitle>
                    <DialogDescription>
                        Save your resume version and cover letter for this company.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            placeholder="Google, Acme Inc..."
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                            id="title"
                            placeholder="Senior Software Engineer..."
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Job Posting URL (Optional)</Label>
                        <Input
                            id="url"
                            placeholder="https://linkedin.com/jobs/..."
                            value={formData.job_url}
                            onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || !formData.company_name || !formData.job_title}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save to Tracker
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
