"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "./template-selector";
import { LaTeXEditor } from "./latex-editor";
import { PDFPreview } from "./pdf-preview";
import { ExportDialog } from "./export-dialog";
import { Code, Eye, Zap, Settings } from "lucide-react";

export function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [latexCode, setLatexCode] = useState("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    const sampleData = {
      personalInfo: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        website: "https://johndoe.com",
      },
      summary:
        "Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
      experience: [
        {
          id: 1,
          company: "Tech Company Inc.",
          position: "Senior Software Engineer",
          startDate: "Jan 2022",
          endDate: "Present",
          description:
            "Led development of microservices architecture serving 1M+ users\nImproved application performance by 40% through optimization\nMentored junior developers and conducted code reviews",
        },
      ],
      education: [],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"],
      projects: [],
    };
    setResumeData(sampleData);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - LaTeX Editor */}
      <div className="w-1/2 border-r border-border flex flex-col">
        {/* Editor Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              LaTeX Editor
            </h2>
            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-medium">Live Compile</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </div>

        {showTemplateSelector && (
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Choose Template
            </h3>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </div>
        )}

        {/* LaTeX Editor */}
        <div className="flex-1 overflow-hidden">
          <LaTeXEditor
            code={latexCode}
            onChange={setLatexCode}
            template={selectedTemplate}
            resumeData={resumeData}
          />
        </div>
      </div>

      {/* Right Panel - PDF Preview */}
      <div className="w-1/2 flex flex-col">
        {/* Preview Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              PDF Preview
            </h2>
            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              <span className="text-xs font-medium">{selectedTemplate}</span>
            </div>
          </div>
          <ExportDialog
            resumeData={resumeData}
            latexCode={latexCode}
            template={selectedTemplate}
            activeTab="latex"
          />
        </div>

        {/* PDF Preview */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <PDFPreview
            resumeData={resumeData}
            template={selectedTemplate}
            latexCode={latexCode}
            activeTab="latex"
          />
        </div>
      </div>
    </div>
  );
}
