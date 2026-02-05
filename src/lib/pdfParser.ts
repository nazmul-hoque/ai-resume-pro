import * as pdfjs from 'pdfjs-dist';

// Set worker source for pdfjs
// We use a CDN version of the worker that matches the installed version
const pdfjsVersion = '4.0.379'; // This should match the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;

export const pdfParser = {
    async extractText(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    }
};
