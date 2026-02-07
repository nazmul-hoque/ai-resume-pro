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
import { markdownToDocx } from "@/utils/markdownToDocx";

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

            const transformerOptions = {
                font: theme.font,
                bodySize: theme.bodySize,
                lineSpacingPts: theme.lineSpacingPts,
                paragraphSpacingPts: theme.paragraphSpacingPts,
                bulletSpacingPts: theme.bulletSpacingPts,
                isCreative
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

            // Generate content batches
            const summaryParas = summary ? await markdownToDocx(summary, transformerOptions) : [];
            const experienceParas = await Promise.all(experience.map(async exp => {
                const header = new Table({
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
                });
                const description = await markdownToDocx(exp.description, transformerOptions);
                return [header, ...description];
            }));

            const educationParas = await Promise.all(education.map(async edu => {
                const header = new Table({
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
                });
                const gpa = edu.gpa ? [new Paragraph({
                    children: [new TextRun({ text: `GPA: ${edu.gpa}`, font: theme.font, size: 18 })],
                    spacing: { after: 150 },
                    indent: isCreative ? { left: convertInchesToTwip(0.15) } : undefined,
                })] : [];
                return [header, ...gpa];
            }));

            const skillsText = skills.map(s => s.name).join(" • ");
            const skillsParas = skillsText ? await markdownToDocx(skillsText, transformerOptions) : [];

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
                        ...(summaryParas.length > 0 ? [
                            createSectionHeader(labels.summary),
                            ...summaryParas,
                        ] : []),

                        // Experience
                        ...(experienceParas.length > 0 ? [
                            createSectionHeader(labels.experience),
                            ...experienceParas.flat(),
                        ] : []),

                        // Education
                        ...(educationParas.length > 0 ? [
                            createSectionHeader(labels.education),
                            ...educationParas.flat(),
                        ] : []),

                        // Skills
                        ...(skillsParas.length > 0 ? [
                            createSectionHeader(labels.skills),
                            ...skillsParas,
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
