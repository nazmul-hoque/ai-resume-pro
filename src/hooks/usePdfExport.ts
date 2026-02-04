import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface UsePdfExportOptions {
  filename?: string;
}

export const usePdfExport = (options: UsePdfExportOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { filename = "resume" } = options;

  const exportToPdf = useCallback(async (elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current) {
      console.error("No element to export");
      return;
    }

    setIsExporting(true);

    try {
      const element = elementRef.current;
      
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate dimensions to fit the content
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Center the image on the page
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = 0;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  }, [filename]);

  return { exportToPdf, isExporting };
};
