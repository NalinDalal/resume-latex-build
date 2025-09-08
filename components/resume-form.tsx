"use client";

import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ResumeFormProps {
  data: any;
  onChange: (data: any) => void;
  template: string;
}

export function ResumeForm({ data, onChange, template }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const updateField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (id: number, field: string, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((exp: any) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    });
  };

  const removeExperience = (id: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp: any) => exp.id !== id),
    });
  };

  return (
    <div className="p-8 space-y-10">
      {/* Personal Information */}
      <Card className="p-8 shadow-md bg-card/95 rounded-lg">
        <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-base font-medium mb-1">Full Name</Label>
            <Input
              id="name"
              value={data.personalInfo.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("name", e.target.value)}
              placeholder="John Doe"
              className="text-base px-4 py-2"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base font-medium mb-1">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
              className="text-base px-4 py-2"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base font-medium mb-1">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="text-base px-4 py-2"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-base font-medium mb-1">Location</Label>
            <Input
              id="location"
              value={data.personalInfo.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("location", e.target.value)}
              placeholder="New York, NY"
              className="text-base px-4 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="website" className="text-base font-medium mb-1">Website/Portfolio</Label>
            <Input
              id="website"
              value={data.personalInfo.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePersonalInfo("website", e.target.value)}
              placeholder="https://johndoe.com"
              className="text-base px-4 py-2"
            />
          </div>
        </div>
      </Card>

      {/* Professional Summary */}
      <Card className="p-8 shadow-md bg-card/95 rounded-lg">
        <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">
          Professional Summary
        </h3>
        <Textarea
          value={data.summary}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("summary", e.target.value)}
          placeholder="Write a brief summary of your professional background and key achievements..."
          className="min-h-[100px] text-base px-4 py-2"
        />
      </Card>

      {/* Work Experience */}
      <Card className="p-8 shadow-md bg-card/95 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            Work Experience
          </h3>
          <Button
            onClick={addExperience}
            className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2 text-base font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Experience
          </Button>
        </div>

        <div className="space-y-6">
          {data.experience.map((exp: any) => (
            <div
              key={exp.id}
              className="border border-border rounded-lg p-6 relative bg-muted/40 shadow-sm"
            >
              <Button
                className="absolute top-3 right-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Label className="text-base font-medium mb-1">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    placeholder="Company Name"
                    className="text-base px-4 py-2"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-1">Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExperience(exp.id, "position", e.target.value)
                    }
                    placeholder="Job Title"
                    className="text-base px-4 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Label className="text-base font-medium mb-1">Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExperience(exp.id, "startDate", e.target.value)
                    }
                    placeholder="MM/YYYY"
                    className="text-base px-4 py-2"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-1">End Date</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExperience(exp.id, "endDate", e.target.value)
                    }
                    placeholder="MM/YYYY or Present"
                    className="text-base px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-1">Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[80px] text-base px-4 py-2"
                />
              </div>
            </div>
          ))}

          {data.experience.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No work experience added yet.</p>
              <p className="text-base">Click "Add Experience" to get started.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
