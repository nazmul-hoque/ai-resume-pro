import React, { useEffect, useState } from "react";
import { applicationService } from "@/services/application.service";
import { JobApplication, ApplicationStatus } from "@/types/application";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, Calendar, Briefcase, FileText } from "lucide-react";
import { format } from "date-fns";
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

const statusColors: Record<ApplicationStatus, string> = {
    Applied: "bg-blue-100 text-blue-800 border-blue-200",
    Interviewing: "bg-purple-100 text-purple-800 border-purple-200",
    Offer: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
};

export const ApplicationDashboard = () => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        const data = await applicationService.getApplications();
        setApplications(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        const success = await applicationService.updateApplicationStatus(id, newStatus);
        if (success) {
            setApplications(prev =>
                prev.map(app => (app.id === id ? { ...app, status: newStatus as ApplicationStatus } : app))
            );
        }
    };

    const handleDelete = async (id: string) => {
        const success = await applicationService.deleteApplication(id);
        if (success) {
            setApplications(prev => prev.filter(app => app.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No applications tracked yet</h3>
                <p className="text-muted-foreground mb-6">
                    Start by generating a cover letter and clicking "Save to Tracker"!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        Job Applications
                    </h2>
                    <p className="text-muted-foreground">Keep track of your job search progress</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                    {applications.length} Applications
                </Badge>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company & Job</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Applied</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">{app.company_name}</span>
                                        <span className="text-sm text-muted-foreground">{app.job_title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={app.status}
                                        onValueChange={(val) => handleStatusChange(app.id, val)}
                                    >
                                        <SelectTrigger className={`w-[140px] h-8 border ${statusColors[app.status]}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Applied">Applied</SelectItem>
                                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                                            <SelectItem value="Offer">Offer</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(app.applied_at), "MMM d, yyyy")}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {app.job_url && (
                                            <Button variant="ghost" size="icon" asChild title="View Job Description">
                                                <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently remove this application from your tracker.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(app.id)}
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
