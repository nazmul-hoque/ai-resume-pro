import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

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

    // Split text into lines to handle layout (lists, newlines)
    const lines = children.split(/\r?\n/);

    return (
        <View style={{ flexDirection: 'column' }}>
            {lines.map((line, lineIndex) => {
                // Check for list items
                const isBullet = /^\s*[•\-\*]\s/.test(line);
                const isOrdered = /^\s*\d+\.\s/.test(line);
                const isList = isBullet || isOrdered;

                let cleanLine = line.trim();
                if (isBullet) cleanLine = cleanLine.replace(/^[•\-\*]\s/, '');
                if (isOrdered) cleanLine = cleanLine.replace(/^\d+\.\s/, '');

                // Process bold/italic formatting within the line
                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                const renderedParts = parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                            <Text key={partIndex} style={styles.bold}>
                                {part.slice(2, -2)}
                            </Text>
                        );
                    }

                    const italicParts = part.split(/(\*.*?\*)/g);
                    return italicParts.map((subPart, subIndex) => {
                        if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2 && !subPart.startsWith('**')) {
                            return <Text key={`${partIndex}-${subIndex}`} style={styles.italic}>{subPart.slice(1, -1)}</Text>
                        }
                        return <Text key={`${partIndex}-${subIndex}`}>{subPart}</Text>;
                    });
                });

                if (isList) {
                    const marker = isBullet ? '•' : line.trim().match(/^\d+\./)?.[0] || '•';
                    return (
                        <View key={lineIndex} style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={{ ...style, width: isOrdered ? 15 : 10 }}>{marker}</Text>
                            <Text style={{ ...style, flex: 1 }}>{renderedParts}</Text>
                        </View>
                    );
                }

                // Standard paragraph/line
                // Only render if line has content or it's a spacer (could filter out empty strings if desired)
                if (!line.trim()) return <View key={lineIndex} style={{ height: 5 }} />; // Paragraph spacing

                return (
                    <Text key={lineIndex} style={style}>
                        {renderedParts}
                    </Text>
                );
            })}
        </View>
    );
};
