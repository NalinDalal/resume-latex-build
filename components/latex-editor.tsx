"use client";

import type React from "react";
import type { LaTeXEditorProps } from "@/types/latex-editor";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { templates } from "@/lib/template-generator";

const sampleLatexCode = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
}

\\begin{document}

\\begin{center}
{\\LARGE \\textbf{John Doe}}\\\\
\\vspace{2pt}
\\href{mailto:john@example.com}{john@example.com} $|$ +1 (555) 123-4567 $|$ New York, NY\\\\
\\href{https://johndoe.com}{johndoe.com} $|$ \\href{https://linkedin.com/in/johndoe}{LinkedIn} $|$ \\href{https://github.com/johndoe}{GitHub}
\\end{center}

\\section{Professional Summary}
Experienced software developer with 5+ years of expertise in full-stack development, 
specializing in React, Node.js, and cloud technologies. Proven track record of 
delivering scalable applications and leading cross-functional teams.

\\section{Experience}
\\textbf{Senior Software Engineer} \\hfill \\textit{Jan 2022 - Present}\\\\
\\textit{Tech Company Inc., New York, NY}
\\begin{itemize}[leftmargin=*]
    \\item Led development of microservices architecture serving 1M+ users
    \\item Improved application performance by 40\\% through optimization
    \\item Mentored junior developers and conducted code reviews
    \\item Implemented automated testing reducing bugs by 60\\%
\\end{itemize}

\\textbf{Software Developer} \\hfill \\textit{Jun 2019 - Dec 2021}\\\\
\\textit{Startup Solutions, San Francisco, CA}
\\begin{itemize}[leftmargin=*]
    \\item Built responsive web applications using React and TypeScript
    \\item Implemented CI/CD pipelines reducing deployment time by 60\\%
    \\item Collaborated with design team to create user-friendly interfaces
    \\item Developed RESTful APIs serving 100K+ daily requests
\\end{itemize}

\\section{Education}
\\textbf{Bachelor of Science in Computer Science} \\hfill \\textit{2015 - 2019}\\\\
\\textit{University of Technology, GPA: 3.8/4.0}

\\section{Skills}
\\textbf{Programming:} JavaScript, TypeScript, Python, Java, Go\\\\
\\textbf{Frontend:} React, Vue.js, HTML5, CSS3, Tailwind CSS, Next.js\\\\
\\textbf{Backend:} Node.js, Express, Django, FastAPI, PostgreSQL, MongoDB\\\\
\\textbf{Tools:} Git, Docker, AWS, Jenkins, Kubernetes, Figma

\\section{Projects}
\\textbf{E-commerce Platform} \\hfill \\textit{2023}\\\\
Built a full-stack e-commerce solution with React, Node.js, and PostgreSQL. 
Features include payment processing, inventory management, and real-time analytics.

\\textbf{Task Management App} \\hfill \\textit{2022}\\\\
Developed a collaborative task management application with real-time updates 
using WebSocket technology and Redux for state management.

\\end{document}`;

const latexTemplates = [
  {
    name: "Academic Resume",
    code: `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]

\\begin{document}
\\begin{center}
{\\LARGE \\textbf{Your Name}}\\\\
\\vspace{2pt}
email@university.edu $|$ +1 (555) 123-4567
\\end{center}

\\section{Education}
\\textbf{Ph.D. in Computer Science} \\hfill \\textit{Expected 2024}\\\\
\\textit{University Name}

\\section{Research Experience}
\\textbf{Research Assistant} \\hfill \\textit{2020 - Present}\\\\
\\textit{AI Research Lab}
\\begin{itemize}[leftmargin=*]
    \\item Research focus on machine learning algorithms
\\end{itemize}

\\section{Publications}
\\begin{itemize}[leftmargin=*]
    \\item Author, A. (2023). "Paper Title." \\textit{Conference Name}.
\\end{itemize}

\\end{document}`,
  },
  {
    name: "Creative Resume",
    code: `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.8in]{geometry}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\definecolor{accent}{RGB}{0, 123, 191}
\\titleformat{\\section}{\\color{accent}\\large\\bfseries}{}{0em}{}[\\color{accent}\\titlerule]

\\begin{document}
\\begin{center}
{\\LARGE \\textbf{\\color{accent}Creative Professional}}\\\\
\\vspace{4pt}
\\textit{Graphic Designer \& Visual Artist}\\\\
\\vspace{2pt}
creative@email.com $|$ Portfolio: creativepro.com
\\end{center}

\\section{Creative Skills}
\\textbf{Design Software:} Adobe Creative Suite, Figma, Sketch\\\\
\\textbf{Specialties:} Brand Identity, Web Design, Print Design

\\section{Portfolio Highlights}
\\textbf{Brand Identity Project} \\hfill \\textit{2023}\\\\
Complete rebrand for tech startup including logo, website, and marketing materials.

\\end{document}`,
  },
  {
    name: "Technical Resume",
    code: `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]

\\begin{document}
\\begin{center}
{\\LARGE \\textbf{Software Engineer}}\\\\
\\vspace{2pt}
\\href{mailto:dev@email.com}{dev@email.com} $|$ \\href{https://github.com/username}{GitHub} $|$ \\href{https://linkedin.com/in/username}{LinkedIn}
\\end{center}

\\section{Technical Skills}
\\textbf{Languages:} Python, JavaScript, Java, C++\\\\
\\textbf{Frameworks:} React, Django, Spring Boot\\\\
\\textbf{Databases:} PostgreSQL, MongoDB, Redis\\\\
\\textbf{Tools:} Docker, Kubernetes, AWS, Git

\\section{Experience}
\\textbf{Senior Software Engineer} \\hfill \\textit{2022 - Present}\\\\
\\textit{Tech Company}
\\begin{itemize}[leftmargin=*]
    \\item Architected microservices handling 1M+ requests/day
    \\item Reduced system latency by 45\\% through optimization
\\end{itemize}

\\end{document}`,
  },
];

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
      Object.keys(resumeData.personalInfo).some(
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
                variant="outline"
                size="sm"
                onClick={generateFromTemplate}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate from Template
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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
                <Button variant="outline" size="sm">
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

            <Button variant="outline" size="sm" onClick={formatCode}>
              <Settings className="w-4 h-4 mr-2" />
              Format
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
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
