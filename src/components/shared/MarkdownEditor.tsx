import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
    value?: string;
    onChange?: (event: { target: { value: string } }) => void;
    placeholder?: string;
    className?: string;
}

export const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(({
    value = "",
    onChange,
    placeholder,
    className,
}, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // We don't want headings in resume summaries usually
                codeBlock: false,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Markdown.configure({
                html: false,
                tightLists: true,
                bulletListMarker: "•",
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            // Access markdown storage through any to avoid TypeScript issues with extension storage
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const editorAny = editor as any;
            const markdown = editorAny.storage?.markdown?.getMarkdown?.() ?? editor.getText();
            onChange?.({ target: { value: markdown } });
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-3 text-sm",
                    className
                ),
            },
        },
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (editor) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const editorAny = editor as any;
            const currentMarkdown = editorAny.storage?.markdown?.getMarkdown?.() ?? editor.getText();
            if (value !== currentMarkdown) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div ref={ref} className="border rounded-md overflow-hidden bg-background">
            <div className="flex items-center gap-1 p-1 border-b bg-muted/20">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-[1px] h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
});

MarkdownEditor.displayName = "MarkdownEditor";
