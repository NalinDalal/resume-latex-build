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
        const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
        const [lastCompiled, setLastCompiled] = useState<string>("");

        useEffect(() => {
          const timeoutId = setTimeout(() => {
            compileLatex();
          }, 1000);
          return () => clearTimeout(timeoutId);
        }, [resumeData, latexCode, template, activeTab]);

        const compileLatex = async () => {
          setIsCompiling(true);
          try {
            const response = await fetch("/api/compile-latex", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latexCode, resumeData, template, mode: activeTab }),
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
          <div className="p-8 h-full flex flex-col">
            {/* Compilation Status */}
            <div className="mb-6">
              {isCompiling && (
                <div className="border border-primary/20 bg-primary/10 shadow-sm rounded-md p-4 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-primary text-base font-medium">Compiling LaTeX... Please wait.</span>
                </div>
              )}

              {compilationResult && !isCompiling && (
                <>
                  {compilationResult.success ? (
                    <div className="border border-green-200 bg-green-50 shadow-sm rounded-md p-4 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 text-base font-medium">
                        Compilation successful! <span className="font-normal">Last compiled at {lastCompiled}</span>
                        {compilationResult.pageCount && (
                          <>
                            <span className="mx-2">•</span> {compilationResult.pageCount} page(s)
                          </>
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="border border-destructive/20 bg-destructive/10 shadow-sm rounded-md p-4 flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive text-base font-medium">
                        Compilation failed. Please check your LaTeX code.
                      </span>
                    </div>
                  )}

                  {/* Show errors */}
                  {compilationResult.errors.length > 0 && (
                    <div className="mt-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="text-base font-semibold text-destructive mb-2">Errors:</h4>
                      <ul className="text-sm text-destructive space-y-1">
                        {compilationResult.errors.map((error, index) => (
                          <li key={index} className="font-mono">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Show warnings */}
                  {compilationResult.warnings.length > 0 && (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-base font-semibold text-yellow-800 mb-2">Warnings:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {compilationResult.warnings.map((warning, index) => (
                          <li key={index} className="font-mono">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* PDF Preview */}
            <Card className="flex-1 flex flex-col bg-white/95 shadow-lg rounded-lg">
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/60 rounded-t-lg">
                <h3 className="text-xl font-bold text-foreground tracking-tight">PDF Preview</h3>
                <div className="flex gap-2">
                  <Button
                    className="rounded-full px-4 py-2 text-sm font-medium border border-border hover:border-primary/40 hover:bg-muted/60"
                    onClick={compileLatex}
                    disabled={isCompiling}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isCompiling ? "animate-spin" : ""}`} />
                    Recompile
                  </Button>
                  {compilationResult?.success && (
                    <Button
                      onClick={downloadPDF}
                      className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center bg-background/80 rounded-b-lg">
                {isCompiling ? (
                  <div className="text-center">
                    <Loader2 className="w-14 h-14 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Compiling LaTeX</h3>
                    <p className="text-muted-foreground text-base">
                      Converting your {activeTab === "form" ? "resume data" : "LaTeX code"} to PDF...
                    </p>
                  </div>
                ) : compilationResult?.success && compilationResult.pdfUrl ? (
                  <div className="w-full h-full p-4">
                    <iframe
                      src={compilationResult.pdfUrl}
                      className="w-full h-full border border-border rounded-md shadow-md"
                      title="Resume PDF Preview"
                    />
                  </div>
                ) : compilationResult && !compilationResult.success ? (
                  <div className="text-center">
                    <AlertCircle className="w-14 h-14 mx-auto mb-4 text-destructive" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Compilation Failed</h3>
                    <p className="text-muted-foreground text-base max-w-sm mx-auto">
                      There were errors in your LaTeX code. Please check the error messages above and fix them.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Compile</h3>
                    <p className="text-muted-foreground text-base max-w-sm mx-auto">
                      {activeTab === "form"
                        ? "Fill out the form to see your resume preview"
                        : "Write LaTeX code to generate your custom resume"}
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>
                        Template: <span className="font-medium capitalize">{template}</span>
                      </p>
                      <p>
                        Mode: <span className="font-medium capitalize">{activeTab}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
  }
