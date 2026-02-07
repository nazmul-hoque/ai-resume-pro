import React, { useEffect, useState } from "react";
import { activityService, UserActivity } from "@/services/activity.service";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    FileUp,
    FileDown,
    Briefcase,
    Globe,
    Sparkles,
    Clock,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const activityIcons: Record<string, any> = {
    resume_created: FileText,
    resume_updated: CheckCircle2,
    resume_imported: FileUp,
    pdf_exported: FileDown,
    docx_exported: FileDown,
    application_saved: Briefcase,
    visibility_changed: Globe,
};

const activityColors: Record<string, string> = {
    resume_created: "text-blue-500 bg-blue-500/10",
    resume_updated: "text-green-500 bg-green-500/10",
    resume_imported: "text-purple-500 bg-purple-500/10",
    pdf_exported: "text-orange-500 bg-orange-500/10",
    docx_exported: "text-orange-500 bg-orange-500/10",
    application_saved: "text-indigo-500 bg-indigo-500/10",
    visibility_changed: "text-emerald-500 bg-emerald-500/10",
};

export const RecentActivity = () => {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            const data = await activityService.getActivities(5);
            setActivities(data);
            setLoading(false);
        };
        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-muted rounded" />
                            <div className="h-2 w-1/4 bg-muted rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground italic text-sm">
                No recent activity to show.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
            </h3>
            <div className="space-y-5">
                {activities.map((activity) => {
                    const Icon = activityIcons[activity.type] || Sparkles;
                    return (
                        <div key={activity.id} className="flex gap-4 group">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                activityColors[activity.type] || "text-primary bg-primary/10"
                            )}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                    {activity.description}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
