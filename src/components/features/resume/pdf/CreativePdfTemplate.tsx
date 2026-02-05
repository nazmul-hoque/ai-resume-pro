import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { Markdown } from './MarkdownPdfRenderer';

import { PDF_THEME } from '@/config/pdf.config';

const PRIMARY_COLOR = PDF_THEME.colors.primary;
const TEXT_LIGHT = '#FFFFFF';

const styles = StyleSheet.create({
    page: {
        padding: '0', // Full width header
        fontFamily: PDF_THEME.fonts.body,
        fontSize: 10,
        lineHeight: 1.5,
        color: PDF_THEME.colors.text.secondary,
        paddingBottom: PDF_THEME.page.padding,
    },
    header: {
        backgroundColor: PRIMARY_COLOR,
        padding: PDF_THEME.page.padding, // Inner padding
        color: TEXT_LIGHT,
        marginBottom: PDF_THEME.spacing.xl,
    },
    contentContainer: {
        paddingHorizontal: PDF_THEME.page.padding,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: TEXT_LIGHT,
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
        marginLeft: 8,
    },
    dot: {
        width: 6,
        height: 15,
        borderRadius: 3,
        backgroundColor: PRIMARY_COLOR,
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    companyName: {
        fontSize: 10,
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
    dateLocation: {
        fontSize: 9,
        color: PDF_THEME.colors.text.muted,
        backgroundColor: PDF_THEME.colors.background.light,
        padding: '2 6',
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    description: {
        fontSize: 10,
        marginTop: 4,
        color: '#444',
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    timelineItem: {
        borderLeft: `1px solid ${PDF_THEME.colors.border}`,
        paddingLeft: 15,
        marginLeft: 3,
        marginBottom: 15,
        position: 'relative',
    },
    timelineDot: {
        position: 'absolute',
        left: -3.5,
        top: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PRIMARY_COLOR,
    },
    skillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillItem: {
        backgroundColor: PRIMARY_COLOR,
        color: '#fff',
        padding: '4 10',
        borderRadius: 10,
        fontSize: 9,
        fontWeight: 'bold',
    },
    educationCard: {
        backgroundColor: PDF_THEME.colors.background.subtle,
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        border: `1px solid ${PDF_THEME.colors.border}`,
    }
});

interface TemplateProps {
    data: ResumeData;
}

export const CreativePdfTemplate = ({ data }: TemplateProps) => {
    const { personalInfo, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.fullName}</Text>
                    <View style={styles.contactInfo}>
                        {personalInfo.email && <Text>{personalInfo.email}</Text>}
                        {personalInfo.phone && <Text>| {personalInfo.phone}</Text>}
                        {personalInfo.location && <Text>| {personalInfo.location}</Text>}
                        {personalInfo.linkedin && <Text>| {personalInfo.linkedin}</Text>}
                        {personalInfo.website && <Text>| {personalInfo.website}</Text>}
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Summary */}
                    {summary && (
                        <View style={styles.section}>
                            <View style={styles.sectionTitleHeader}>
                                <View style={styles.dot} />
                                <Text style={styles.sectionTitle}>About Me</Text>
                            </View>
                            <View style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: 12, marginLeft: 2 }}>
                                <Markdown style={styles.description}>{summary}</Markdown>
                            </View>
                        </View>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionTitleHeader}>
                                <View style={styles.dot} />
                                <Text style={styles.sectionTitle}>Experience</Text>
                            </View>
                            <View style={{ marginLeft: 2 }}>
                                {experience.map((job, index) => (
                                    <View key={index} style={styles.timelineItem}>
                                        <View style={styles.timelineDot} />
                                        <View style={styles.row}>
                                            <View>
                                                <Text style={styles.jobTitle}>{job.position}</Text>
                                                <Text style={styles.companyName}>
                                                    {job.company} {job.location ? `• ${job.location}` : ''}
                                                </Text>
                                            </View>
                                            <Text style={styles.dateLocation}>
                                                {job.startDate} - {job.current ? 'Present' : job.endDate}
                                            </Text>
                                        </View>
                                        <Markdown style={styles.description}>{job.description}</Markdown>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionTitleHeader}>
                                <View style={styles.dot} />
                                <Text style={styles.sectionTitle}>Education</Text>
                            </View>
                            {education.map((edu, index) => (
                                <View key={index} style={styles.educationCard}>
                                    <View style={styles.row}>
                                        <View>
                                            <Text style={[styles.jobTitle, { fontSize: 10 }]}>{edu.degree} in {edu.field}</Text>
                                            <Text style={[styles.companyName, { color: '#666' }]}>{edu.institution}</Text>
                                        </View>
                                        <Text style={[styles.dateLocation, { backgroundColor: 'transparent', padding: 0 }]}>
                                            {edu.startDate} - {edu.endDate}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionTitleHeader}>
                                <View style={styles.dot} />
                                <Text style={styles.sectionTitle}>Skills</Text>
                            </View>
                            <View style={styles.skillGroup}>
                                {skills.map((skill, index) => (
                                    <Text key={index} style={styles.skillItem}>{skill.name}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};
