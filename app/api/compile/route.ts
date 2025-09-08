import { type NextRequest, NextResponse } from "next/server";
import { generateTemplateLatex } from "@/lib/template-generator";

export async function POST(request: NextRequest) {
  try {
    const { latexCode, resumeData, template, mode } = await request.json();

    // For now, we'll simulate compilation and return a success response
    // In a real implementation, you would use a LaTeX compiler service

    if (!latexCode && !resumeData) {
      return NextResponse.json(
        { error: "No content to compile" },
        { status: 400 },
      );
    }

    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let finalLatexCode = latexCode;

    if (mode === "form" && resumeData) {
      try {
        finalLatexCode = generateTemplateLatex(resumeData, template);
      } catch (error) {
        console.error("Template generation error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Template generation failed",
            errors: [
              error instanceof Error ? error.message : "Unknown template error",
            ],
            warnings: [],
          },
          { status: 500 },
        );
      }
    }

    // Simulate successful compilation
    const compilationResult = {
      success: true,
      pdfUrl: `/api/generate-pdf?timestamp=${Date.now()}&template=${template}&mode=${mode}`, // Include template in URL
      errors: [],
      warnings: [],
      compiledAt: new Date().toISOString(),
      pageCount: 1,
      generatedLatex: mode === "form" ? finalLatexCode : undefined, // Return generated LaTeX for form mode
    };

    return NextResponse.json(compilationResult);
  } catch (error) {
    console.error("LaTeX compilation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Compilation failed",
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      },
      { status: 500 },
    );
  }
}
