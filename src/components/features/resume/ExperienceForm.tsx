import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { toast } from "sonner";
import { useState } from "react";
import { BulletPointBuilder } from "./BulletPointBuilder";
import { ResumeData } from "@/types/resume";

export const ExperienceForm = () => {
  const { control, getValues, setValue } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const { getSuggestion, isLoading } = useAiSuggestion();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAiImprove = async (index: number) => {
    const exp = getValues(`experience.${index}`);
    setLoadingId(exp.id);

    const suggestion = await getSuggestion("experience", {
      currentText: exp.description || undefined,
      jobTitle: exp.position || undefined,
      company: exp.company || undefined,
    });

    if (suggestion) {
      setValue(`experience.${index}.description`, suggestion, { shouldDirty: true });
      toast.success("Description improved with AI!");
    }

    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No work experience added yet</p>
          <Button
            variant="outline"
            onClick={() => append({
              id: crypto.randomUUID(),
              company: "",
              position: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })}
            className="gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Experience {index + 1}
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
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`experience.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <FormField
                      control={control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
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
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input
                              type="month"
                              {...field}
                              disabled={getValues(`experience.${index}.current`)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name={`experience.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm cursor-pointer">
                            I currently work here
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <div className="flex items-center gap-2">
                    <BulletPointBuilder
                      onAdd={(bullet) => {
                        const current = getValues(`experience.${index}.description`) || "";
                        const prefix = current.length > 0 ? (current.endsWith("\n") ? "" : "\n") : "";
                        setValue(`experience.${index}.description`, `${current}${prefix}• ${bullet}`, { shouldDirty: true });
                      }}
                      jobTitle={getValues(`experience.${index}.position`) || undefined}
                      company={getValues(`experience.${index}.company`) || undefined}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => handleAiImprove(index)}
                      disabled={isLoading && loadingId === field.id}
                      type="button"
                    >
                      {isLoading && loadingId === field.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {isLoading && loadingId === field.id ? "Improving..." : "AI Improve"}
                    </Button>
                  </div>
                </div>
                <FormField
                  control={control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          {...field}
                          className="min-h-[100px]"
                        />
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
              company: "",
              position: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })}
            className="w-full gap-2"
            type="button"
          >
            <Plus className="w-4 h-4" />
            Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
};
