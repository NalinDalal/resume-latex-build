"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFPreviewProps {
  resumeData: any;
  template: string;
  latexCode: string;
  activeTab: "form" | "latex";
}

interface CompilationResult {
  success: boolean;
  pdfUrl?: string;
  errors: string[];
  warnings: string[];
  compiledAt?: string;
  pageCount?: number;
}

export function PDFPreview({
  resumeData,
  template,
  latexCode,
  activeTab,
}: PDFPreviewProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationResult, setCompilationResult] =
    useState<CompilationResult | null>(null);
  const [lastCompiled, setLastCompiled] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      compileLatex();
    }, 1000); // Debounce compilation by 1 second

    return () => clearTimeout(timeoutId);
  }, [resumeData, latexCode, template, activeTab]);

  const compileLatex = async () => {
    setIsCompiling(true);

    try {
      const response = await fetch("/api/compile-latex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latexCode,
          resumeData,
          template,
          mode: activeTab,
        }),
      });

      const result = await response.json();
      setCompilationResult(result);

      if (result.success) {
        setLastCompiled(new Date().toLocaleTimeString());
      }
    } catch (error) {
      setCompilationResult({
        success: false,
        errors: ["Network error: Failed to compile LaTeX"],
        warnings: [],
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadPDF = () => {
    if (compilationResult?.pdfUrl) {
      const link = document.createElement("a");
      link.href = compilationResult.pdfUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Compilation Status */}
      <div className="mb-4">
        {isCompiling && (
          <Alert className="border-primary/20 bg-primary/5">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <AlertDescription className="text-primary">
              Compiling LaTeX... Please wait.
            </AlertDescription>
          </Alert>
        )}

        {compilationResult && !isCompiling && (
          <>
            {compilationResult.success ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Compilation successful! Last compiled at {lastCompiled}
                  {compilationResult.pageCount &&
                    ` • ${compilationResult.pageCount} page(s)`}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  Compilation failed. Please check your LaTeX code.
                </AlertDescription>
              </Alert>
            )}

            {/* Show errors */}
            {compilationResult.errors.length > 0 && (
              <div className="mt-2 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                <h4 className="text-sm font-semibold text-destructive mb-2">
                  Errors:
                </h4>
                <ul className="text-xs text-destructive space-y-1">
                  {compilationResult.errors.map((error, index) => (
                    <li key={index} className="font-mono">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show warnings */}
            {compilationResult.warnings.length > 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  Warnings:
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {compilationResult.warnings.map((warning, index) => (
                    <li key={index} className="font-mono">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* PDF Preview */}
      <Card className="flex-1 flex flex-col bg-white shadow-lg">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
          <h3 className="text-lg font-semibold text-foreground">PDF Preview</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={compileLatex}
              disabled={isCompiling}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isCompiling ? "animate-spin" : ""}`}
              />
              Recompile
            </Button>
            {compilationResult?.success && (
              <Button
                size="sm"
                onClick={downloadPDF}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {isCompiling ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Compiling LaTeX
              </h3>
              <p className="text-muted-foreground text-sm">
                Converting your{" "}
                {activeTab === "form" ? "resume data" : "LaTeX code"} to PDF...
              </p>
            </div>
          ) : compilationResult?.success && compilationResult.pdfUrl ? (
            <div className="w-full h-full p-4">
              <iframe
                src={compilationResult.pdfUrl}
                className="w-full h-full border border-border rounded-md"
                title="Resume PDF Preview"
              />
            </div>
          ) : compilationResult && !compilationResult.success ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Compilation Failed
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                There were errors in your LaTeX code. Please check the error
                messages above and fix them.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to Compile
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {activeTab === "form"
                  ? "Fill out the form to see your resume preview"
                  : "Write LaTeX code to generate your custom resume"}
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>
                  Template:{" "}
                  <span className="font-medium capitalize">{template}</span>
                </p>
                <p>
                  Mode:{" "}
                  <span className="font-medium capitalize">{activeTab}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
