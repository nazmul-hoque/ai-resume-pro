import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, Share2, Globe, Lock, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";
import { resumeService } from "@/services/resume.service";
import { activityService } from "@/services/activity.service";

interface ShareDialogProps {
    resumeId: string;
    isPublic: boolean;
    onUpdate: (isPublic: boolean) => void;
}

export const ShareDialog = ({ resumeId, isPublic, onUpdate }: ShareDialogProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const shareUrl = `${window.location.origin}/share/${resumeId}`;

    const handleTogglePublic = async (checked: boolean) => {
        setIsUpdating(true);
        try {
            await resumeService.updateResume(resumeId, undefined, undefined, undefined, checked);
            onUpdate(checked);
            toast.success(checked ? "Resume is now public" : "Resume is now private");
            activityService.logActivity('visibility_changed', `Changed resume visibility to ${checked ? 'Public' : 'Private'}`);
        } catch (error) {
            console.error("Error updating resume visibility:", error);
            toast.error("Failed to update visibility");
        } finally {
            setIsUpdating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Resume</DialogTitle>
                    <DialogDescription>
                        Make your resume public to share it with recruiters via a link.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4 w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-4 w-full overflow-hidden">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-full shrink-0 ${isPublic ? 'bg-green-100' : 'bg-slate-100'}`}>
                                {isPublic ? (
                                    <Globe className={`h-5 w-5 ${isPublic ? 'text-green-600' : 'text-slate-600'}`} />
                                ) : (
                                    <Lock className="h-5 w-5 text-slate-600" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <Label htmlFor="public-toggle" className="font-semibold cursor-pointer block truncate">
                                    Public Link
                                </Label>
                                <p className="text-xs text-muted-foreground truncate">
                                    {isPublic ? "Visible to anyone with the link" : "Private (only you can see it)"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="public-toggle"
                            checked={isPublic}
                            onCheckedChange={handleTogglePublic}
                            disabled={isUpdating}
                            className="shrink-0"
                        />
                    </div>

                    {isPublic && (
                        <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 w-full overflow-hidden">
                            <div className="flex items-center gap-2 w-full">
                                <div className="flex-1 min-w-0 bg-muted p-2 rounded border text-[11px] truncate font-mono">
                                    {shareUrl}
                                </div>
                                <Button size="sm" variant="secondary" onClick={copyToClipboard} className="shrink-0">
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 text-xs"
                                onClick={() => window.open(shareUrl, '_blank')}
                            >
                                <ExternalLink className="h-3 w-3" />
                                Preview Public Page
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 py-0 border-none sm:justify-start">
                    <p className="text-[10px] text-muted-foreground italic leading-tight">
                        By making this public, you acknowledge that anyone with the link can view your personal info.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
