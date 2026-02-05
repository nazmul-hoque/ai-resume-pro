import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

export const EducationForm = () => {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No education added yet</p>
          <Button
            variant="outline"
            onClick={() => append({
              id: crypto.randomUUID(),
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              gpa: "",
            })}
            className="gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Education {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor's, Master's, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="3.8/4.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={() => append({
              id: crypto.randomUUID(),
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              gpa: "",
            })}
            className="w-full gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Add Another Education
          </Button>
        </>
      )}
    </div>
  );
};
