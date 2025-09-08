import { type NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request: NextRequest) {
  try {
    const {
      latexCode,
      resumeData,
      template,
      mode,
      options = {},
    } = await request.json();

    const {
      format = "a4",
      orientation = "portrait",
      fontSize = 11,
      margins = { top: 20, right: 20, bottom: 20, left: 20 },
      filename = "resume.pdf",
    } = options;

    const pdf = new jsPDF({
      orientation: orientation as "portrait" | "landscape",
      unit: "mm",
      format: format.toLowerCase(),
    });

    // Set margins
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margins.left - margins.right;
    let currentY = margins.top;

    // Generate content based on mode
    if (mode === "form" && resumeData) {
      currentY = generatePDFFromResumeData(
        pdf,
        resumeData,
        template,
        margins,
        contentWidth,
        currentY,
        fontSize,
      );
    } else if (mode === "latex" && latexCode) {
      currentY = generatePDFFromLatex(
        pdf,
        latexCode,
        margins,
        contentWidth,
        currentY,
        fontSize,
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const pdfContent = generatePlaceholderPDF();

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume-preview.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF preview error:", error);
    return NextResponse.json({ error: "PDF preview failed" }, { status: 500 });
  }
}

function generatePDFFromResumeData(
  pdf: jsPDF,
  resumeData: any,
  template: string,
  margins: any,
  contentWidth: number,
  startY: number,
  fontSize: number,
): number {
  let currentY = startY;
  const { personalInfo, summary, experience, education, skills, projects } =
    resumeData;

  // Header - Name and Contact
  if (personalInfo.name) {
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(personalInfo.name, margins.left, currentY);
    currentY += 10;
  }

  // Contact Information
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);
  if (personalInfo.website) contactInfo.push(personalInfo.website);

  if (contactInfo.length > 0) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(contactInfo.join(" | "), margins.left, currentY);
    currentY += 15;
  }

  // Professional Summary
  if (summary) {
    currentY = addSection(
      pdf,
      "Professional Summary",
      summary,
      margins.left,
      currentY,
      contentWidth,
      fontSize,
    );
  }

  // Experience
  if (experience && experience.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Experience", margins.left, currentY);
    currentY += 8;

    experience.forEach((exp: any) => {
      // Job title and dates
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "bold");
      pdf.text(exp.position || "Position", margins.left, currentY);

      if (exp.startDate || exp.endDate) {
        const dateText = `${exp.startDate || "Start"} - ${exp.endDate || "End"}`;
        const dateWidth = pdf.getTextWidth(dateText);
        pdf.text(dateText, margins.left + contentWidth - dateWidth, currentY);
      }
      currentY += 5;

      // Company
      if (exp.company) {
        pdf.setFont("helvetica", "italic");
        pdf.text(exp.company, margins.left, currentY);
        currentY += 5;
      }

      // Description
      if (exp.description) {
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(exp.description, contentWidth - 10);
        pdf.text(lines, margins.left + 5, currentY);
        currentY += lines.length * 4 + 5;
      }

      currentY += 3;
    });
  }

  // Education
  if (education && education.length > 0) {
    currentY = addSection(
      pdf,
      "Education",
      "",
      margins.left,
      currentY,
      contentWidth,
      fontSize,
    );
    education.forEach((edu: any) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "bold");
      pdf.text(edu.degree || "Degree", margins.left, currentY);

      if (edu.year) {
        const yearWidth = pdf.getTextWidth(edu.year);
        pdf.text(edu.year, margins.left + contentWidth - yearWidth, currentY);
      }
      currentY += 5;

      if (edu.school) {
        pdf.setFont("helvetica", "italic");
        pdf.text(edu.school, margins.left, currentY);
        currentY += 8;
      }
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills;
    currentY = addSection(
      pdf,
      "Skills",
      skillsText,
      margins.left,
      currentY,
      contentWidth,
      fontSize,
    );
  }

  // Projects
  if (projects && projects.length > 0) {
    currentY = addSection(
      pdf,
      "Projects",
      "",
      margins.left,
      currentY,
      contentWidth,
      fontSize,
    );
    projects.forEach((project: any) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "bold");
      pdf.text(project.name || "Project", margins.left, currentY);

      if (project.year) {
        const yearWidth = pdf.getTextWidth(project.year);
        pdf.text(
          project.year,
          margins.left + contentWidth - yearWidth,
          currentY,
        );
      }
      currentY += 5;

      if (project.description) {
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(
          project.description,
          contentWidth - 5,
        );
        pdf.text(lines, margins.left, currentY);
        currentY += lines.length * 4 + 8;
      }
    });
  }

  return currentY;
}

function generatePDFFromLatex(
  pdf: jsPDF,
  latexCode: string,
  margins: any,
  contentWidth: number,
  startY: number,
  fontSize: number,
): number {
  // Basic LaTeX to PDF conversion (simplified)
  // In a real implementation, you would use a proper LaTeX parser
  let currentY = startY;

  pdf.setFontSize(fontSize);
  pdf.setFont("helvetica", "normal");

  const lines = latexCode.split("\n");
  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("\\section{")) {
      const sectionTitle = trimmedLine.match(/\\section\{([^}]+)\}/)?.[1] || "";
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(sectionTitle, margins.left, currentY);
      currentY += 8;
    } else if (trimmedLine.startsWith("\\textbf{")) {
      const boldText = trimmedLine.match(/\\textbf\{([^}]+)\}/)?.[1] || "";
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "bold");
      pdf.text(boldText, margins.left, currentY);
      currentY += 5;
    } else if (trimmedLine && !trimmedLine.startsWith("\\")) {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "normal");
      const textLines = pdf.splitTextToSize(trimmedLine, contentWidth);
      pdf.text(textLines, margins.left, currentY);
      currentY += textLines.length * 4 + 2;
    }
  });

  return currentY;
}

function addSection(
  pdf: jsPDF,
  title: string,
  content: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
): number {
  let currentY = y;

  // Section title
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, x, currentY);
  currentY += 8;

  // Section content
  if (content) {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(content, width);
    pdf.text(lines, x, currentY);
    currentY += lines.length * 4 + 8;
  }

  return currentY;
}

function generatePlaceholderPDF(): Buffer {
  // This is a minimal PDF structure for demonstration
  // In a real implementation, you would use a proper PDF generation library
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Resume Preview) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000368 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
465
%%EOF`;

  return Buffer.from(pdfContent, "utf-8");
}
