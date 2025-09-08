export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  documentClass: string;
  packages: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    main: string;
    heading: string;
  };
  layout: {
    margins: string;
    spacing: string;
    sectionFormat: string;
  };
}

export const templates: Record<string, TemplateConfig> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with subtle colors",
    preview: "/modern-resume-template.png",
    documentClass: "article",
    packages: [
      "geometry",
      "titlesec",
      "enumitem",
      "xcolor",
      "hyperref",
      "fontspec",
    ],
    colors: {
      primary: "0891b2", // cyan-600
      secondary: "6366f1", // indigo-500
      accent: "0f172a", // slate-900
    },
    fonts: {
      main: "\\setmainfont{Calibri}",
      heading: "\\setsansfont{Calibri}",
    },
    layout: {
      margins: "margin=0.75in",
      spacing: "\\titlespacing*{\\section}{0pt}{16pt}{8pt}",
      sectionFormat:
        "\\titleformat{\\section}{\\large\\sfseries\\bfseries\\color{primary}}{}{0em}{}[\\color{primary}\\titlerule]",
    },
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional format perfect for conservative industries",
    preview: "/classic-resume-template-preview.jpg",
    documentClass: "article",
    packages: ["geometry", "titlesec", "enumitem"],
    colors: {
      primary: "000000",
      secondary: "333333",
      accent: "666666",
    },
    fonts: {
      main: "\\usepackage{times}",
      heading: "",
    },
    layout: {
      margins: "margin=1in",
      spacing: "\\titlespacing*{\\section}{0pt}{12pt}{6pt}",
      sectionFormat:
        "\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]",
    },
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Bold design with visual elements for creative roles",
    preview: "/creative-resume-template.png",
    documentClass: "article",
    packages: [
      "geometry",
      "titlesec",
      "enumitem",
      "xcolor",
      "hyperref",
      "tikz",
      "fontspec",
    ],
    colors: {
      primary: "ec4899", // pink-500
      secondary: "8b5cf6", // violet-500
      accent: "06b6d4", // cyan-500
    },
    fonts: {
      main: "\\setmainfont{Montserrat}",
      heading: "\\setsansfont{Montserrat}",
    },
    layout: {
      margins: "margin=0.6in",
      spacing: "\\titlespacing*{\\section}{0pt}{18pt}{10pt}",
      sectionFormat:
        "\\titleformat{\\section}{\\Large\\sfseries\\bfseries\\color{primary}}{}{0em}{}[\\color{secondary}\\titlerule[2pt]]",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with focus on content",
    preview: "/minimal-resume-template-preview.jpg",
    documentClass: "article",
    packages: ["geometry", "titlesec", "enumitem"],
    colors: {
      primary: "374151", // gray-700
      secondary: "6b7280", // gray-500
      accent: "9ca3af", // gray-400
    },
    fonts: {
      main: "\\usepackage{lmodern}",
      heading: "",
    },
    layout: {
      margins: "margin=1.2in",
      spacing: "\\titlespacing*{\\section}{0pt}{14pt}{7pt}",
      sectionFormat: "\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}",
    },
  },
};

export function generateTemplateLatex(
  resumeData: any,
  templateId: string,
): string {
  const template = templates[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const { personalInfo, summary, experience, education, skills, projects } =
    resumeData;

  // Build document header
  let latex = `\\documentclass[11pt,a4paper]{${template.documentClass}}
\\usepackage[utf8]{inputenc}
\\usepackage[${template.layout.margins}]{geometry}
`;

  // Add packages
  template.packages.forEach((pkg) => {
    latex += `\\usepackage{${pkg}}
`;
  });

  // Add color definitions
  latex += `
\\definecolor{primary}{HTML}{${template.colors.primary}}
\\definecolor{secondary}{HTML}{${template.colors.secondary}}
\\definecolor{accent}{HTML}{${template.colors.accent}}
`;

  // Add fonts
  if (template.fonts.main) {
    latex += `${template.fonts.main}
`;
  }
  if (template.fonts.heading) {
    latex += `${template.fonts.heading}
`;
  }

  // Add layout formatting
  latex += `
${template.layout.sectionFormat}
${template.layout.spacing}
`;

  // Add hyperref setup if included
  if (template.packages.includes("hyperref")) {
    latex += `
\\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    urlcolor=primary,
    pdfborder={0 0 0}
}
`;
  }

  latex += `
\\begin{document}
`;

  // Generate header based on template
  latex += generateTemplateHeader(personalInfo, template);

  // Generate sections
  if (summary) {
    latex += generateTemplateSection("Professional Summary", summary, template);
  }

  if (experience && experience.length > 0) {
    latex += generateExperienceSection(experience, template);
  }

  if (education && education.length > 0) {
    latex += generateEducationSection(education, template);
  }

  if (skills && skills.length > 0) {
    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills;
    latex += generateTemplateSection("Skills", skillsText, template);
  }

  if (projects && projects.length > 0) {
    latex += generateProjectsSection(projects, template);
  }

  latex += `
\\end{document}`;

  return latex;
}

function generateTemplateHeader(
  personalInfo: any,
  template: TemplateConfig,
): string {
  let header = "";

  switch (template.id) {
    case "modern":
      header = `
\\begin{center}
{\\Huge\\sffamily\\bfseries\\color{primary} ${personalInfo.name || "Your Name"}}\\\\[8pt]
`;
      break;
    case "creative":
      header = `
\\begin{center}
\\begin{tikzpicture}
\\node[rectangle, fill=primary!10, rounded corners=5pt, minimum width=\\textwidth-2cm, minimum height=1.5cm] at (0,0) {};
\\node[text=primary] at (0,0) {\\Huge\\sffamily\\bfseries ${personalInfo.name || "Your Name"}};
\\end{tikzpicture}\\\\[10pt]
`;
      break;
    case "classic":
      header = `
\\begin{center}
{\\LARGE\\bfseries ${personalInfo.name || "Your Name"}}\\\\[6pt]
`;
      break;
    case "minimal":
      header = `
\\begin{center}
{\\Large\\bfseries ${personalInfo.name || "Your Name"}}\\\\[4pt]
`;
      break;
    default:
      header = `
\\begin{center}
{\\LARGE\\bfseries ${personalInfo.name || "Your Name"}}\\\\[6pt]
`;
  }

  // Add contact information
  const contactInfo = [];
  if (personalInfo.email) {
    if (template.packages.includes("hyperref")) {
      contactInfo.push(
        `\\href{mailto:${personalInfo.email}}{${personalInfo.email}}`,
      );
    } else {
      contactInfo.push(personalInfo.email);
    }
  }
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);
  if (personalInfo.website) {
    if (template.packages.includes("hyperref")) {
      contactInfo.push(
        `\\href{${personalInfo.website}}{${personalInfo.website}}`,
      );
    } else {
      contactInfo.push(personalInfo.website);
    }
  }

  if (contactInfo.length > 0) {
    const separator =
      template.id === "creative" ? " \\textcolor{secondary}{|} " : " $|$ ";
    header += `{\\color{secondary} ${contactInfo.join(separator)}}
`;
  }

  header += `\\end{center}
\\vspace{10pt}

`;

  return header;
}

function generateTemplateSection(
  title: string,
  content: string,
  template: TemplateConfig,
): string {
  return `\\section{${title}}
${content}

`;
}

function generateExperienceSection(
  experience: any[],
  template: TemplateConfig,
): string {
  let section = `\\section{Experience}
`;

  experience.forEach((exp) => {
    switch (template.id) {
      case "modern":
        section += `\\textbf{\\color{primary}${exp.position || "Position"}} \\hfill \\textit{\\color{secondary}${exp.startDate || "Start"} - ${exp.endDate || "End"}}\\\\
\\textit{${exp.company || "Company"}}
`;
        break;
      case "creative":
        section += `{\\large\\sffamily\\bfseries\\color{primary}${exp.position || "Position"}} \\hfill {\\color{secondary}\\textit{${exp.startDate || "Start"} - ${exp.endDate || "End"}}}\\\\
{\\color{accent}\\textit{${exp.company || "Company"}}}
`;
        break;
      default:
        section += `\\textbf{${exp.position || "Position"}} \\hfill \\textit{${exp.startDate || "Start"} - ${exp.endDate || "End"}}\\\\
\\textit{${exp.company || "Company"}}
`;
    }

    if (exp.description) {
      const bullets = exp.description
        .split("\n")
        .filter((line: string) => line.trim());
      section += `\\begin{itemize}[leftmargin=*]
`;
      bullets.forEach((bullet: string) => {
        section += `    \\item ${bullet.trim()}
`;
      });
      section += `\\end{itemize}

`;
    }
  });

  return section;
}

function generateEducationSection(
  education: any[],
  template: TemplateConfig,
): string {
  let section = `\\section{Education}
`;

  education.forEach((edu) => {
    switch (template.id) {
      case "modern":
        section += `\\textbf{\\color{primary}${edu.degree || "Degree"}} \\hfill \\textit{\\color{secondary}${edu.year || "Year"}}\\\\
\\textit{${edu.school || "School"}}

`;
        break;
      case "creative":
        section += `{\\sffamily\\bfseries\\color{primary}${edu.degree || "Degree"}} \\hfill {\\color{secondary}\\textit{${edu.year || "Year"}}}\\\\
{\\color{accent}\\textit{${edu.school || "School"}}}

`;
        break;
      default:
        section += `\\textbf{${edu.degree || "Degree"}} \\hfill \\textit{${edu.year || "Year"}}\\\\
\\textit{${edu.school || "School"}}

`;
    }
  });

  return section;
}

function generateProjectsSection(
  projects: any[],
  template: TemplateConfig,
): string {
  let section = `\\section{Projects}
`;

  projects.forEach((project) => {
    switch (template.id) {
      case "modern":
        section += `\\textbf{\\color{primary}${project.name || "Project"}} \\hfill \\textit{\\color{secondary}${project.year || "Year"}}\\\\
${project.description || "Project description"}

`;
        break;
      case "creative":
        section += `{\\sffamily\\bfseries\\color{primary}${project.name || "Project"}} \\hfill {\\color{secondary}\\textit{${project.year || "Year"}}}\\\\
${project.description || "Project description"}

`;
        break;
      default:
        section += `\\textbf{${project.name || "Project"}} \\hfill \\textit{${project.year || "Year"}}\\\\
${project.description || "Project description"}

`;
    }
  });

  return section;
}
