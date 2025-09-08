"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
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
      <div className="w-full md:w-1/2 border-r border-border flex flex-col bg-card/80 transition-all duration-200">
        {/* Editor Header */}
        <div className="p-6 border-b border-border bg-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              LaTeX Editor
            </h2>
            <div className="flex items-center gap-1 ml-3 px-3 py-1 bg-green-100/80 text-green-700 rounded-full text-xs font-medium">
              <Zap className="w-4 h-4" />
              Live Compile
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full px-4 py-2 text-sm font-medium border-border hover:border-primary/40 hover:bg-muted/60"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </div>

        {showTemplateSelector && (
          <div className="p-6 border-b border-border bg-muted/60 animate-fade-in">
            <h3 className="text-base font-semibold mb-4 text-foreground">
              Choose Template
            </h3>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </div>
        )}

        {/* LaTeX Editor */}
        <div className="flex-1 overflow-hidden bg-background/60">
          <LaTeXEditor
            code={latexCode}
            onChange={setLatexCode}
            template={selectedTemplate}
            resumeData={resumeData}
          />
        </div>
      </div>

      {/* Right Panel - PDF Preview */}
      <div className="w-full md:w-1/2 flex flex-col bg-card/80 transition-all duration-200">
        {/* Preview Header */}
        <div className="p-6 border-b border-border bg-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              PDF Preview
            </h2>
            <div className="flex items-center gap-1 ml-3 px-3 py-1 bg-blue-100/80 text-blue-700 rounded-full text-xs font-medium capitalize">
              {selectedTemplate}
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
        <div className="flex-1 overflow-auto bg-muted/40">
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
