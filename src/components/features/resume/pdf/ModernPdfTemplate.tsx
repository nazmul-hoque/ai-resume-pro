import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { Markdown } from './MarkdownPdfRenderer';

// Register fonts if needed, otherwise use standard fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff' },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: '20mm',
        fontFamily: 'Helvetica', // Fallback to standard font for reliability
        fontSize: 10,
        lineHeight: 1.5,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #eee',
        paddingBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        fontSize: 9,
        color: '#666',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111',
        textTransform: 'uppercase',
        marginBottom: 8,
        borderLeft: '3px solid #000',
        paddingLeft: 8,
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    companyName: {
        fontSize: 11,
        color: '#444',
    },
    dateLocation: {
        fontSize: 9,
        color: '#888',
        marginBottom: 4,
    },
    description: {
        fontSize: 10,
        marginTop: 4,
        color: '#444',
        textAlign: 'justify',
    },
    skillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillItem: {
        backgroundColor: '#f3f4f6',
        padding: '4 8',
        borderRadius: 4,
        fontSize: 9,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
});

interface ModernPdfTemplateProps {
    data: ResumeData;
}

export const ModernPdfTemplate = ({ data }: ModernPdfTemplateProps) => {
    const { personalInfo, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.fullName}</Text>
                    <View style={styles.contactInfo}>
                        {personalInfo.email && <Text>{personalInfo.email}</Text>}
                        {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
                        {personalInfo.location && <Text>{personalInfo.location}</Text>}
                        {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
                        {personalInfo.website && <Text>{personalInfo.website}</Text>}
                    </View>
                </View>


                {/* Summary */}
                {summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Markdown style={styles.description}>{summary}</Markdown>
                    </View>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {experience.map((job, index) => (
                            <View key={index} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <Text style={styles.jobTitle}>{job.position}</Text>
                                    <Text style={styles.dateLocation}>
                                        {job.startDate} - {job.current ? 'Present' : job.endDate}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.companyName}>{job.company}</Text>
                                    <Text style={styles.dateLocation}>{job.location}</Text>
                                </View>
                                <Markdown style={styles.description}>{job.description}</Markdown>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu, index) => (
                            <View key={index} style={{ marginBottom: 10 }}>
                                <View style={styles.row}>
                                    <Text style={styles.companyName}>{edu.institution}</Text>
                                    <Text style={styles.dateLocation}>
                                        {edu.startDate} - {edu.endDate}
                                    </Text>
                                </View>
                                <Text style={styles.jobTitle}>{edu.degree} in {edu.field}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillGroup}>
                            {skills.map((skill, index) => (
                                <Text key={index} style={styles.skillItem}>{skill.name}</Text>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};
