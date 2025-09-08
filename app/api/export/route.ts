import { type NextRequest, NextResponse } from "next/server";
import { generateTemplateLatex } from "@/lib/template-generator";

export async function POST(request: NextRequest) {
  try {
    const {
      latexCode,
      resumeData,
      template,
      mode,
      filename = "resume.tex",
    } = await request.json();

    let finalLatexCode = latexCode;

    if (mode === "form" && resumeData) {
      try {
        finalLatexCode = generateTemplateLatex(resumeData, template);
      } catch (error) {
        console.error("Template LaTeX generation error:", error);
        return NextResponse.json(
          { error: "Template LaTeX generation failed" },
          { status: 500 },
        );
      }
    }

    if (!finalLatexCode) {
      return NextResponse.json(
        { error: "No LaTeX content to export" },
        { status: 400 },
      );
    }

    // Return LaTeX source file
    return new NextResponse(finalLatexCode, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("LaTeX export error:", error);
    return NextResponse.json({ error: "LaTeX export failed" }, { status: 500 });
  }
}
