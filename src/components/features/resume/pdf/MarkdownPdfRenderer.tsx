import React from 'react';
import { Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
});

interface MarkdownProps {
    children: string;
    style?: any;
}

export const Markdown = ({ children, style }: MarkdownProps) => {
    if (!children) return null;

    // Simple parser for **bold** and *italic*
    // Splits by bold syntax first
    const parts = children.split(/(\*\*.*?\*\*)/g);

    return (
        <Text style={style}>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // It's bold
                    const content = part.slice(2, -2);
                    return (
                        <Text key={index} style={styles.bold}>
                            {content}
                        </Text>
                    );
                }

                // Check for italic within the non-bold parts
                // Note: nesting bold inside italic or vice versa is not handled by this simple regex
                const italicParts = part.split(/(\*.*?\*)/g);
                return italicParts.map((subPart, subIndex) => {
                    if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2 && !subPart.startsWith('**')) {
                        const content = subPart.slice(1, -1);
                        return <Text key={`${index}-${subIndex}`} style={styles.italic}>{content}</Text>
                    }
                    return <Text key={`${index}-${subIndex}`}>{subPart}</Text>;
                });
            })}
        </Text>
    );
};
