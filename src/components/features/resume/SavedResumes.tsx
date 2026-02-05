import { useState } from "react";
import { useResumes, useDeleteResume, useDuplicateResume, useUpdateResume, Resume } from "@/hooks/useResumes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Plus, Trash2, Loader2, Calendar, Copy, Edit3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedResumesProps {
  onSelectResume: (resume: Resume) => void;
  onCreateNew: () => void;
}

export const SavedResumes = ({ onSelectResume, onCreateNew }: SavedResumesProps) => {
  const { data: resumes, isLoading } = useResumes();
  const deleteResume = useDeleteResume();
  const duplicateResume = useDuplicateResume();
  const updateResume = useUpdateResume();

  const [renamingResume, setRenamingResume] = useState<Resume | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleRenameClick = (resume: Resume, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingResume(resume);
    setNewTitle(resume.title);
  };

  const handleRenameSubmit = async () => {
    if (!renamingResume || !newTitle.trim()) return;

    await updateResume.mutateAsync({
      id: renamingResume.id,
      title: newTitle.trim(),
    });

    setRenamingResume(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold font-display">Your Resumes</h2>
        <Button onClick={onCreateNew} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Resume
        </Button>
      </div>

      {resumes && resumes.length > 0 ? (
        <ScrollArea className="h-[400px]">
          <div className="grid gap-3">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectResume(resume)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{resume.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => handleRenameClick(resume, e)}
                        title="Rename"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => duplicateResume.mutate(resume.id)}
                        disabled={duplicateResume.isPending}
                        title="Duplicate"
                      >
                        {duplicateResume.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{resume.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteResume.mutate(resume.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {resume.data.personalInfo?.fullName || "No name set"} • {resume.template} template
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No resumes yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first resume to get started
          </p>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Resume
          </Button>
        </Card>
      )}

      <Dialog open={!!renamingResume} onOpenChange={(open) => !open && setRenamingResume(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to help you identify it (e.g., "Software Engineer - Google").
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Resume Name</Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="My Awesome Resume"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingResume(null)}>Cancel</Button>
            <Button onClick={handleRenameSubmit} disabled={updateResume.isPending || !newTitle.trim()}>
              {updateResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};