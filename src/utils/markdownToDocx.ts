import {
    Paragraph,
    TextRun,
    AlignmentType,
    LineRuleType,
    convertInchesToTwip
} from "docx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Content, ListItem, Text, Strong, Emphasis, Link } from "mdast";

interface TransformOptions {
    font: string;
    bodySize: number;
    lineSpacingPts: number;
    paragraphSpacingPts: number;
    bulletSpacingPts: number;
    isCreative?: boolean;
    color?: string;
    bold?: boolean;
    italics?: boolean;
}

/**
 * Transforms Markdown string into docx Paragraphs using Remark AST
 */
export async function markdownToDocx(markdown: string, options: TransformOptions): Promise<Paragraph[]> {
    if (!markdown) return [];

    const processor = unified().use(remarkParse);
    const ast = processor.parse(markdown) as Root;

    const paragraphs: Paragraph[] = [];

    for (const node of ast.children) {
        if (node.type === 'paragraph') {
            const children = transformChildren(node.children, options);
            paragraphs.push(new Paragraph({
                children,
                spacing: {
                    after: options.paragraphSpacingPts * 20,
                    line: options.lineSpacingPts * 20,
                    lineRule: LineRuleType.EXACT
                },
                alignment: AlignmentType.LEFT,
                indent: options.isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
            }));
        } else if (node.type === 'list') {
            for (const item of node.children as ListItem[]) {
                // List items usually contain a paragraph
                for (const subNode of item.children) {
                    if (subNode.type === 'paragraph') {
                        const children = transformChildren(subNode.children, options);
                        paragraphs.push(new Paragraph({
                            children,
                            bullet: { level: 0 },
                            spacing: {
                                after: options.bulletSpacingPts * 20,
                                line: options.lineSpacingPts * 20,
                                lineRule: LineRuleType.EXACT
                            },
                            alignment: AlignmentType.LEFT,
                            indent: options.isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                        }));
                    }
                }
            }
        }
    }

    return paragraphs;
}

function transformChildren(children: Content[], options: TransformOptions, inheritedStyles: { bold?: boolean, italics?: boolean, color?: string } = {}): TextRun[] {
    const runs: TextRun[] = [];

    for (const node of children) {
        if (node.type === 'text') {
            runs.push(new TextRun({
                text: (node as Text).value,
                font: options.font,
                size: options.bodySize,
                color: inheritedStyles.color || options.color,
                bold: inheritedStyles.bold || options.bold,
                italics: inheritedStyles.italics || options.italics,
            }));
        } else if (node.type === 'strong') {
            runs.push(...transformChildren((node as Strong).children, options, { ...inheritedStyles, bold: true }));
        } else if (node.type === 'emphasis') {
            runs.push(...transformChildren((node as Emphasis).children, options, { ...inheritedStyles, italics: true }));
        } else if (node.type === 'link') {
            // Render links as underlined blue text
            runs.push(...transformChildren((node as Link).children, options, { ...inheritedStyles, color: "2563EB" }));
        } else if (node.type === 'break') {
            runs.push(new TextRun({ break: 1 }));
        }
    }

    return runs;
}
