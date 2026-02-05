import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { ResumeData } from "@/types/resume";

export const PersonalInfoForm = () => {
  const { control } = useFormContext<ResumeData>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="personalInfo.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone
              </FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Location
              </FormLabel>
              <FormControl>
                <Input placeholder="New York, NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-muted-foreground" />
                LinkedIn (optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="linkedin.com/in/johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Website (optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="johndoe.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
