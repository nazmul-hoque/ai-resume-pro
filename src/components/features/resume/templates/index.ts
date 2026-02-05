import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { CreativeTemplate } from "./CreativeTemplate";

export type TemplateId = "modern" | "classic" | "creative";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with bold headers",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered layout with serif fonts",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful with timeline and skill badges",
  },
];

export { ModernTemplate, ClassicTemplate, CreativeTemplate };
