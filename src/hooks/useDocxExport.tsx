import { useCallback, useState } from "react";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType,
    VerticalAlign,
    convertInchesToTwip
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

interface UseDocxExportOptions {
    filename?: string;
}

export const useDocxExport = (options: UseDocxExportOptions = {}) => {
    const [isExportingDocx, setIsExportingDocx] = useState(false);
    const { filename = "resume" } = options;

    const exportToDocx = useCallback(async (data: ResumeData) => {
        setIsExportingDocx(true);

        try {
            const { personalInfo, summary, experience, education, skills } = data;

            // Helper to parse markdown-like bold/italic in text
            const parseFormatting = (text: string) => {
                if (!text) return [new TextRun("")];

                const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                return parts.map(part => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return new TextRun({ text: part.slice(2, -2), bold: true });
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                        return new TextRun({ text: part.slice(1, -1), italics: true });
                    }
                    return new TextRun(part);
                });
            };

            // Helper to check if a line is a horizontal rule
            const isHorizontalRule = (line: string) => {
                const trimmed = line.trim();
                return /^[-*_]{3,}$/.test(trimmed) || /^(- ){3,}-?$/.test(trimmed);
            };

            // Helper to handle multiline text and lists
            const createContentParagraphs = (text: string) => {
                if (!text) return [];
                return text.split('\n')
                    .filter(line => line.trim() && !isHorizontalRule(line))
                    .map(line => {
                        const trimmed = line.trim();
                        const isBullet = /^[*•-]\s/.test(trimmed);
                        const content = isBullet ? trimmed.replace(/^[*•-]\s/, '') : trimmed;

                        return new Paragraph({
                            children: parseFormatting(content),
                            bullet: isBullet ? { level: 0 } : undefined,
                            spacing: { after: 120 },
                        });
                    });
            };

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: convertInchesToTwip(0.75),
                                bottom: convertInchesToTwip(0.75),
                                left: convertInchesToTwip(0.75),
                                right: convertInchesToTwip(0.75),
                            },
                        },
                    },
                    children: [
                        // Header: Name
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: personalInfo.fullName.toUpperCase(),
                                    bold: true,
                                    size: 32, // 16pt
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 120 },
                        }),

                        // Contact Info
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: [
                                        personalInfo.email,
                                        personalInfo.phone,
                                        personalInfo.location,
                                        personalInfo.linkedin,
                                        personalInfo.website
                                    ].filter(Boolean).join(" | "),
                                    size: 18, // 9pt
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 },
                        }),

                        // Summary Section
                        ...(summary ? [
                            new Paragraph({
                                text: "PROFESSIONAL SUMMARY",
                                heading: HeadingLevel.HEADING_1,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 200, after: 120 },
                            }),
                            ...createContentParagraphs(summary),
                        ] : []),

                        // Experience Section
                        ...(experience.length > 0 ? [
                            new Paragraph({
                                text: "PROFESSIONAL EXPERIENCE",
                                heading: HeadingLevel.HEADING_1,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 200, after: 120 },
                            }),
                            ...experience.flatMap(exp => [
                                ...(exp.position || exp.company ? [
                                    new Table({
                                        width: { size: 100, type: WidthType.PERCENTAGE },
                                        borders: {
                                            top: { style: BorderStyle.NIL },
                                            bottom: { style: BorderStyle.NIL },
                                            left: { style: BorderStyle.NIL },
                                            right: { style: BorderStyle.NIL },
                                            insideHorizontal: { style: BorderStyle.NIL },
                                            insideVertical: { style: BorderStyle.NIL }
                                        },
                                        rows: [
                                            new TableRow({
                                                children: [
                                                    new TableCell({
                                                        children: [new Paragraph({ children: [new TextRun({ text: exp.position, bold: true })] })],
                                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                                    }),
                                                    new TableCell({
                                                        children: [new Paragraph({
                                                            children: [new TextRun({ text: `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}` })],
                                                            alignment: AlignmentType.RIGHT
                                                        })],
                                                        width: { size: 30, type: WidthType.PERCENTAGE },
                                                    }),
                                                ],
                                            }),
                                            new TableRow({
                                                children: [
                                                    new TableCell({
                                                        children: [new Paragraph({ children: [new TextRun({ text: `${exp.company}${exp.location ? `, ${exp.location}` : ""}`, italics: true })] })],
                                                        width: { size: 100, type: WidthType.PERCENTAGE },
                                                        columnSpan: 2,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    })
                                ] : []),
                                ...createContentParagraphs(exp.description),
                            ])
                        ] : []),

                        // Education Section
                        ...(education.length > 0 ? [
                            new Paragraph({
                                text: "EDUCATION",
                                heading: HeadingLevel.HEADING_1,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 200, after: 120 },
                            }),
                            ...education.flatMap(edu => [
                                new Table({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    borders: {
                                        top: { style: BorderStyle.NIL },
                                        bottom: { style: BorderStyle.NIL },
                                        left: { style: BorderStyle.NIL },
                                        right: { style: BorderStyle.NIL },
                                        insideHorizontal: { style: BorderStyle.NIL },
                                        insideVertical: { style: BorderStyle.NIL }
                                    },
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({ children: [new TextRun({ text: edu.institution, bold: true })] })],
                                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}` })],
                                                        alignment: AlignmentType.RIGHT
                                                    })],
                                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                                }),
                                            ],
                                        }),
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}` })],
                                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                                    columnSpan: 2,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                ...(edu.gpa ? [new Paragraph({ text: `GPA: ${edu.gpa}`, spacing: { after: 100 } })] : []),
                            ])
                        ] : []),

                        // Skills Section
                        ...(skills.length > 0 ? [
                            new Paragraph({
                                text: "SKILLS",
                                heading: HeadingLevel.HEADING_1,
                                border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                                spacing: { before: 200, after: 120 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: skills.map(s => s.name).join(" • ") })
                                ],
                                spacing: { after: 200 },
                            }),
                        ] : []),
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${filename}.docx`);

        } catch (error) {
            console.error("Failed to export DOCX:", error);
        } finally {
            setIsExportingDocx(false);
        }
    }, [filename]);

    return { exportToDocx, isExportingDocx };
};
