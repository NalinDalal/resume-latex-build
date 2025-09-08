"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
    <div className="p-6 space-y-6">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={data.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
        </div>
      </Card>

      {/* Professional Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Professional Summary
        </h3>
        <Textarea
          value={data.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="Write a brief summary of your professional background and key achievements..."
          className="min-h-[100px]"
        />
      </Card>

      {/* Work Experience */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Work Experience
          </h3>
          <Button
            onClick={addExperience}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        <div className="space-y-4">
          {data.experience.map((exp: any) => (
            <div
              key={exp.id}
              className="border border-border rounded-lg p-4 relative"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(exp.id, "position", e.target.value)
                    }
                    placeholder="Job Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "startDate", e.target.value)
                    }
                    placeholder="MM/YYYY"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "endDate", e.target.value)
                    }
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}

          {data.experience.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No work experience added yet.</p>
              <p className="text-sm">Click "Add Experience" to get started.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
