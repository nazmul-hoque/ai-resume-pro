import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, ListPlus, Wand2, ArrowRight } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface BulletPointBuilderProps {
    onAdd: (bullet: string) => void;
    jobTitle?: string;
    company?: string;
}

export const BulletPointBuilder = ({ onAdd, jobTitle, company }: BulletPointBuilderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState("");
    const [task, setTask] = useState("");
    const [result, setResult] = useState("");
    const [isPolishing, setIsPolishing] = useState(false);
    const [preview, setPreview] = useState("");

    const updatePreview = (a: string, t: string, r: string) => {
        if (!a && !t && !r) {
            setPreview("");
            return;
        }
        const bullet = `${a || "[Action]"} ${t || "[Task/Responsibility]"} resulting in ${r || "[Result/Impact]"}`;
        setPreview(bullet);
    };

    const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAction(val);
        updatePreview(val, task, result);
    };

    const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTask(val);
        updatePreview(action, val, result);
    };

    const handleResultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setResult(val);
        updatePreview(action, task, val);
    };

    const handlePolish = async () => {
        if (!preview || preview.includes("[")) {
            toast.error("Please fill out the fields first");
            return;
        }

        setIsPolishing(true);
        try {
            const suggestion = await aiService.getSuggestion("experience", {
                currentText: preview,
                jobTitle,
                company,
            });
            if (suggestion) {
                // Extract first bullet if AI returns multiple
                const polished = suggestion.split("\n")[0].replace(/^•\s*/, "").trim();
                setPreview(polished);
                toast.success("Bullet point polished by AI!");
            }
        } catch (error) {
            toast.error("Failed to polish. Using original text.");
        } finally {
            setIsPolishing(false);
        }
    };

    const handleAdd = () => {
        if (preview) {
            onAdd(preview);
            setIsOpen(false);
            // Reset
            setAction("");
            setTask("");
            setResult("");
            setPreview("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-dashed border-primary/50 hover:border-primary">
                    <ListPlus className="w-3.5 h-3.5 text-primary" />
                    Achievement Builder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Smart Bullet Point Constructor
                    </DialogTitle>
                    <DialogDescription>
                        Use the STAR method to create high-impact achievements.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="action" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Strong Action Verb</Label>
                        <Input
                            id="action"
                            placeholder="e.g. Led, Developed, Optimized, Managed"
                            value={action}
                            onChange={handleActionChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="task" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. The Task or Responsibility</Label>
                        <Input
                            id="task"
                            placeholder="e.g. a team of 5 developers on a legacy migration project"
                            value={task}
                            onChange={handleTaskChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="result" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3. Result or Impact (Quantifiable)</Label>
                        <Input
                            id="result"
                            placeholder="e.g. a 30% reduction in server costs"
                            value={result}
                            onChange={handleResultChange}
                        />
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-primary/10 space-y-3">
                        <Label className="text-[10px] font-bold uppercase text-primary/70 tracking-widest">Preview</Label>
                        <div className="text-sm font-medium leading-relaxed italic text-foreground/80">
                            {preview || "Start typing to see your achievement grow..."}
                        </div>
                        {preview && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full gap-2 text-xs h-8 bg-primary/10 hover:bg-primary/20 text-primary border-none"
                                onClick={handlePolish}
                                disabled={isPolishing}
                            >
                                {isPolishing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Wand2 className="w-3.5 h-3.5" />
                                )}
                                {isPolishing ? "AI is polishing..." : "Polish with AI"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={!preview || preview.includes("[")} className="gap-2">
                        Add to Experience
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
