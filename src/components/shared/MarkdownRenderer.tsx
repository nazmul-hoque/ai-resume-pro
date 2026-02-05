import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
    return (
        <div className={cn("prose prose-sm max-w-none w-full break-words overflow-hidden dark:prose-invert prose-p:leading-relaxed prose-headings:mb-2 prose-p:mb-1", className)}>
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-0">{children}</ul>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
