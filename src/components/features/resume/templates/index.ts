import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { CreativeTemplate } from "./CreativeTemplate";

export type TemplateId = "modern" | "classic" | "creative";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  tags: string[];
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with bold headers",
    tags: ["Tech", "Fresh Graduate", "Business"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered layout with serif fonts",
    tags: ["Executive", "Academic", "Business", "Tech"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful with timeline and skill badges",
    tags: ["Creative", "Fresh Graduate", "Tech"],
  },
];

export { ModernTemplate, ClassicTemplate, CreativeTemplate };
