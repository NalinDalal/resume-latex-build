"use client";

import type React from "react";
import type { LaTeXEditorProps } from "@/types/latex-editor";

import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Copy,
  RefreshCw,
  FileText,
  Zap,
  Settings,
  ChevronDown,
  Wand2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import { templates } from "@/lib/template-generator";

const latexTemplates = Object.values(templates).map(t => ({ name: t.name, code: t.id }));

const sampleLatexCode = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}{\\titlerule}
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    pdfborder={0 0 0}
}

\\begin{document}

\\section{Experience}
\\textbf{Software Engineer} \\hfill \\textit{2022 - Present}\\\\
\\textit{Tech Company, City}
\\begin{itemize}[leftmargin=*]
    \\item Developed scalable web applications using React and Node.js
    \\item Reduced system latency by 45\\% through optimization
\\end{itemize}

\\end{document}`


const latexSnippets = [
  {
    name: "Section",
    code: "\\section{Section Title}",
    description: "Add a new section",
  },
  {
    name: "Bold Text",
    code: "\\textbf{bold text}",
    description: "Make text bold",
  },
  {
    name: "Italic Text",
    code: "\\textit{italic text}",
    description: "Make text italic",
  },
  {
    name: "Bullet List",
    code: "\\begin{itemize}[leftmargin=*]\n    \\item First item\n    \\item Second item\n\\end{itemize}",
    description: "Create a bullet point list",
  },
  {
    name: "Job Entry",
    code: "\\textbf{Job Title} \\hfill \\textit{Start Date - End Date}\\\\\n\\textit{Company Name, Location}\n\\begin{itemize}[leftmargin=*]\n    \\item Achievement or responsibility\n\\end{itemize}",
    description: "Add a job experience entry",
  },
  {
    name: "Education Entry",
    code: "\\textbf{Degree Name} \\hfill \\textit{Graduation Year}\\\\\n\\textit{University Name, Location}",
    description: "Add an education entry",
  },
  {
    name: "Hyperlink",
    code: "\\href{https://example.com}{Link Text}",
    description: "Create a clickable link",
  },
];

export function LaTeXEditor({
  code,
  onChange,
  template = "modern",
  resumeData,
}: LaTeXEditorProps) {
  const [lineNumbers, setLineNumbers] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split("\n");
  const lineCount = lines.length;

  const loadSample = () => {
    if (
      resumeData &&
        (Object.keys(resumeData.personalInfo) as Array<keyof typeof resumeData.personalInfo>).some(
          (key) => resumeData.personalInfo[key],
        )
    ) {
      generateFromTemplate();
    } else {
      onChange(sampleLatexCode);
    }
  };

  const generateFromTemplate = async () => {
    try {
      const response = await fetch("/api/compile-latex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          template,
          mode: "form",
        }),
      });

      const result = await response.json();
      if (result.success && result.generatedLatex) {
        onChange(result.generatedLatex);
      }
    } catch (error) {
      console.error("Failed to generate template LaTeX:", error);
      onChange(sampleLatexCode);
    }
  };

  const loadTemplate = (templateCode: string) => {
    onChange(templateCode);
  };

  const insertSnippet = (snippetCode: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode =
        code.substring(0, start) + snippetCode + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + snippetCode.length,
          start + snippetCode.length,
        );
      }, 0);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const formatCode = () => {
    const formatted = code
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("\\begin{") || trimmed.startsWith("\\item")) {
          return "    " + trimmed;
        }
        if (trimmed.startsWith("\\end{")) {
          return trimmed;
        }
        if (trimmed.startsWith("\\section") || trimmed.startsWith("\\textbf")) {
          return trimmed;
        }
        return line;
      })
      .join("\n");
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.setSelectionRange(start + 4, start + 4);
      }, 0);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
          <h3 className="text-lg font-semibold text-foreground">
            LaTeX Code Editor
          </h3>
          <div className="flex gap-2">
            {resumeData && (
              <Button
                className="border border-border bg-muted/60 px-4 py-2 rounded-full text-sm font-medium"
                onClick={generateFromTemplate}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate from Template
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border border-border bg-muted/60 px-4 py-2 rounded-full text-sm font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {latexTemplates.map((template, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => loadTemplate(template.code)}
                  >
                    {template.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={loadSample}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load Sample
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border border-border bg-muted/60 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Snippets
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {latexSnippets.map((snippet, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => insertSnippet(snippet.code)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{snippet.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {snippet.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={formatCode}>
              <Settings className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {lineNumbers && (
            <div className="bg-muted/30 border-r border-border p-4 text-right min-w-[60px]">
              <div className="font-mono text-sm text-muted-foreground leading-6">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i + 1} className="h-6">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 p-4">
            <Textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your LaTeX code here..."
              className="w-full h-full min-h-[500px] font-mono text-sm resize-none border-0 focus-visible:ring-0 leading-6"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Current Template: {templates[template]?.name}
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Colors: {templates[template]?.colors.primary.slice(0, 6)}</li>
            <li>• Packages: {templates[template]?.packages.length} included</li>
            <li>• Layout: {templates[template]?.layout.margins}</li>
            <li>• Click "Generate from Template" to apply current template</li>
          </ul>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            LaTeX Tips:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              • Use{" "}
              <code className="bg-background px-1 rounded">
                \\section{"{}"}
              </code>{" "}
              for main headings
            </li>
            <li>
              • Use{" "}
              <code className="bg-background px-1 rounded">\\textbf{"{}"}</code>{" "}
              for bold text
            </li>
            <li>
              • Use{" "}
              <code className="bg-background px-1 rounded">\\textit{"{}"}</code>{" "}
              for italic text
            </li>
            <li>
              • Use{" "}
              <code className="bg-background px-1 rounded">
                \\color{"{}"}primary
              </code>{" "}
              for template colors
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
