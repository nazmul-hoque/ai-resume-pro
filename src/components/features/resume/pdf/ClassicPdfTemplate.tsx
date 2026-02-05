import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { Markdown } from './MarkdownPdfRenderer';

const styles = StyleSheet.create({
    page: {
        padding: '20mm',
        fontFamily: 'Times-Roman',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #ccc',
        paddingBottom: 20,
        textAlign: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        fontSize: 9,
        color: '#555',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
        marginBottom: 8,
        borderBottom: '1px solid #ccc',
        paddingBottom: 2,
        letterSpacing: 1,
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    companyName: {
        fontSize: 11,
        fontStyle: 'italic',
        color: '#444',
    },
    dateLocation: {
        fontSize: 9,
        fontStyle: 'italic',
        color: '#666',
    },
    description: {
        fontSize: 10,
        marginTop: 4,
        color: '#333',
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    skillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
});

interface TemplateProps {
    data: ResumeData;
}

export const ClassicPdfTemplate = ({ data }: TemplateProps) => {
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
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {experience.map((job, index) => (
                            <View key={index} style={{ marginBottom: 12 }}>
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
                                {/* Ensure compatible fields based on ModernPdfTemplate fix */}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={{ fontSize: 10, color: '#333' }}>
                            {skills.map(s => s.name).join(' • ')}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};
