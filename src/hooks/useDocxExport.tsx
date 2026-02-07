import { useCallback, useState } from "react";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType,
    convertInchesToTwip,
    LineRuleType
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";
import { TemplateId } from "../components/features/resume/templates";

interface UseDocxExportOptions {
    filename?: string;
}

export const useDocxExport = (options: UseDocxExportOptions = {}) => {
    const [isExportingDocx, setIsExportingDocx] = useState(false);
    const { filename = "resume" } = options;

    const exportToDocx = useCallback(async (data: ResumeData, templateId: TemplateId = "modern") => {
        setIsExportingDocx(true);

        try {
            const { personalInfo, summary, experience, education, skills } = data;

            // Define template-aware styles and labels
            const isClassic = templateId === "classic";
            const isCreative = templateId === "creative";

            const labels = {
                summary: isCreative ? "About Me" : "Professional Summary",
                experience: isClassic ? "Professional Experience" : (isCreative ? "Experience" : "Work Experience"),
                education: "Education",
                skills: "Skills"
            };

            const theme = {
                font: isClassic ? "Times New Roman" : "Arial",
                headingFont: isClassic ? "Times New Roman" : "Arial",
                headerAlignment: isClassic ? AlignmentType.CENTER : AlignmentType.LEFT,
                sectionAlignment: AlignmentType.LEFT,
                sectionHeaderColor: isCreative ? "2563EB" : "000000",
                headingSize: 26, // 13pt
                bodySize: 22, // 11pt
                nameSize: 56, // 28pt
                subheadingSize: 24, // 12pt
                headerUppercase: isClassic || templateId === "modern",
                // Use exact point values for spacing (20 twips = 1pt)
                lineSpacingPts: 14, // 14pt line height for 11pt text (good readable spacing)
                paragraphSpacingPts: 6, // 6pt after paragraphs
                bulletSpacingPts: 4, // 4pt after bullets
            };

            // Formatting helper
            const parseFormatting = (text: string, options: { bold?: boolean, italics?: boolean, size?: number, color?: string } = {}) => {
                if (!text) return [new TextRun("")];
                const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                return parts.map(part => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return new TextRun({
                            text: part.slice(2, -2),
                            bold: true,
                            font: theme.font,
                            size: options.size || theme.bodySize,
                            color: options.color
                        });
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                        return new TextRun({
                            text: part.slice(1, -1),
                            italics: true,
                            font: theme.font,
                            size: options.size || theme.bodySize,
                            color: options.color
                        });
                    }
                    return new TextRun({
                        text: part,
                        bold: options.bold,
                        italics: options.italics,
                        font: theme.font,
                        size: options.size || theme.bodySize,
                        color: options.color
                    });
                });
            };

            const isHorizontalRule = (line: string) => {
                const trimmed = line.trim();
                return /^[ \t]*[-*_]{3,}[ \t]*$/.test(trimmed);
            };

            const createContentParagraphs = (text: string, size?: number) => {
                if (!text) return [];
                return text.split('\n')
                    .filter(line => line.trim() && !isHorizontalRule(line))
                    .map(line => {
                        const trimmed = line.trim();
                        const isBullet = /^[*•-]\s/.test(trimmed);
                        const content = isBullet ? trimmed.replace(/^[*•-]\s/, '') : trimmed;
                        return new Paragraph({
                            children: parseFormatting(content, { size }),
                            bullet: isBullet ? { level: 0 } : undefined,
                            spacing: { 
                                after: (isBullet ? theme.bulletSpacingPts : theme.paragraphSpacingPts) * 20, // Convert pt to twips
                                line: theme.lineSpacingPts * 20, // Convert pt to twips
                                lineRule: LineRuleType.EXACT
                            },
                            alignment: AlignmentType.LEFT,
                            indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                        });
                    });
            };

            const createSectionHeader = (title: string) => {
                const creativeAccent = isCreative ? [
                    new TextRun({
                        text: " ",
                        size: theme.headingSize,
                        font: theme.headingFont,
                    })
                ] : [];

                return new Paragraph({
                    children: [
                        ...creativeAccent,
                        new TextRun({
                            text: theme.headerUppercase ? title.toUpperCase() : title,
                            bold: true,
                            size: theme.headingSize,
                            font: theme.headingFont,
                            color: theme.sectionHeaderColor,
                        }),
                    ],
                    border: isCreative ? { left: { color: "2563EB", space: 4, style: BorderStyle.SINGLE, size: 24 } } : { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    spacing: { before: 500, after: 300 },
                    alignment: theme.sectionAlignment,
                });
            };

            // Creative Header (Table with Background)
            // Using explicit twip widths to prevent vertical collapse (8.5" - 1.2" margin = 7.3" = ~10500 twips)
            const creativeHeader = isCreative ? new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                columnWidths: [10000],
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
                                shading: { fill: "2563EB" },
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                margins: { top: 800, bottom: 800, left: 600, right: 400 },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: personalInfo.fullName,
                                                bold: true,
                                                size: theme.nameSize,
                                                font: theme.headingFont,
                                                color: "FFFFFF",
                                            }),
                                        ],
                                        spacing: { after: 200 },
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: [
                                                    personalInfo.email,
                                                    personalInfo.phone,
                                                    personalInfo.location,
                                                    personalInfo.linkedin,
                                                    personalInfo.website
                                                ].filter(Boolean).join(" • "),
                                                size: 18,
                                                font: theme.font,
                                                color: "FFFFFF",
                                            }),
                                        ],
                                        spacing: { after: 0 },
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }) : null;

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: convertInchesToTwip(0.6),
                                bottom: convertInchesToTwip(0.6),
                                left: convertInchesToTwip(0.6),
                                right: convertInchesToTwip(0.6),
                            },
                        },
                    },
                    children: [
                        // Header Logic
                        ...(isCreative ? [creativeHeader!, new Paragraph({ spacing: { after: 600 } })] : [
                            // Name (Standard)
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: isClassic ? personalInfo.fullName.toUpperCase() : personalInfo.fullName,
                                        bold: true,
                                        size: theme.nameSize,
                                        font: theme.headingFont,
                                    }),
                                ],
                                alignment: theme.headerAlignment,
                                spacing: { after: 200 },
                            }),

                            // Contact Info (Standard)
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: [
                                            personalInfo.email,
                                            personalInfo.phone,
                                            personalInfo.location,
                                            personalInfo.linkedin,
                                            personalInfo.website
                                        ].filter(Boolean).join(isClassic ? " | " : " • "),
                                        size: 18,
                                        font: theme.font,
                                    }),
                                ],
                                alignment: theme.headerAlignment,
                                spacing: { after: 600 },
                            }),
                        ]),

                        // Summary
                        ...(summary ? [
                            createSectionHeader(labels.summary),
                            ...createContentParagraphs(summary),
                        ] : []),

                        // Experience
                        ...(experience.length > 0 ? [
                            createSectionHeader(labels.experience),
                            ...experience.flatMap(exp => [
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
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: exp.position, bold: true, font: theme.font, size: theme.subheadingSize })],
                                                        spacing: { after: 60 },
                                                        indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                                                    })],
                                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`, font: theme.font, size: 18 })],
                                                        alignment: AlignmentType.RIGHT,
                                                        spacing: { after: 60 }
                                                    })],
                                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                                }),
                                            ],
                                        }),
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: `${exp.company}${exp.location ? `, ${exp.location}` : ""}`, italics: true, font: theme.font, size: 18 })],
                                                        spacing: { after: 100 },
                                                        indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                                                    })],
                                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                                    columnSpan: 2,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                ...createContentParagraphs(exp.description),
                            ])
                        ] : []),

                        // Education
                        ...(education.length > 0 ? [
                            createSectionHeader(labels.education),
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
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: edu.institution, bold: true, font: theme.font, size: theme.subheadingSize })],
                                                        spacing: { after: 60 },
                                                        indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                                                    })],
                                                    width: { size: 70, type: WidthType.PERCENTAGE },
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, font: theme.font, size: 18 })],
                                                        alignment: AlignmentType.RIGHT,
                                                        spacing: { after: 60 }
                                                    })],
                                                    width: { size: 30, type: WidthType.PERCENTAGE },
                                                }),
                                            ],
                                        }),
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, font: theme.font, size: 18 })],
                                                        spacing: { after: 60 },
                                                        indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                                                    })],
                                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                                    columnSpan: 2,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                ...(edu.gpa ? [new Paragraph({
                                    children: [new TextRun({ text: `GPA: ${edu.gpa}`, font: theme.font, size: 18 })],
                                    spacing: { after: 150 },
                                    indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                                })] : []),
                            ])
                        ] : []),

                        // Skills
                        ...(skills.length > 0 ? [
                            createSectionHeader(labels.skills),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: skills.map(s => s.name).join(" • "), font: theme.font, size: theme.bodySize })
                                ],
                                spacing: { after: 300, line: theme.lineSpacingPts * 20, lineRule: LineRuleType.EXACT },
                                indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
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
