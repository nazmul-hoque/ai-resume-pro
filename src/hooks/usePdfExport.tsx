import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
import { TemplateId } from "@/components/features/resume/templates";
import { ModernPdfTemplate } from "@/components/features/resume/pdf/ModernPdfTemplate";
import { ClassicPdfTemplate } from "@/components/features/resume/pdf/ClassicPdfTemplate";
import { CreativePdfTemplate } from "@/components/features/resume/pdf/CreativePdfTemplate";

interface UsePdfExportOptions {
  filename?: string;
}

export const usePdfExport = (options: UsePdfExportOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { filename = "resume" } = options;

  const exportToPdf = useCallback(async (data: ResumeData, template: TemplateId) => {
    setIsExporting(true);

    try {
      // Select the correct PDF template based on the ID
      let DocumentComponent;
      switch (template) {
        case 'classic':
          DocumentComponent = <ClassicPdfTemplate data={data} />;
          break;
        case 'creative':
          DocumentComponent = <CreativePdfTemplate data={data} />;
          break;
        case 'modern':
        default:
          DocumentComponent = <ModernPdfTemplate data={data} />;
          break;
      }

      const blob = await pdf(DocumentComponent).toBlob();
      const url = URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  }, [filename]);

  return { exportToPdf, isExporting };
};
