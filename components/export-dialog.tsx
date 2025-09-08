"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
// Dialog and Tabs components removed as they do not exist
import { Download, FileText, Code, Settings } from "lucide-react";
import { Card } from "./ui/card";

interface ExportDialogProps {
  resumeData: any;
  latexCode: string;
  template: string;
  activeTab: "form" | "latex";
}

export function ExportDialog({
  resumeData,
  latexCode,
  template,
  activeTab,
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: "a4",
    orientation: "portrait",
    fontSize: 11,
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    filename: "resume",
  });

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latexCode,
          resumeData,
          template,
          mode: activeTab,
          options: {
            ...exportOptions,
            filename: `${exportOptions.filename}.pdf`,
          },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${exportOptions.filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsOpen(false);
      } else {
        console.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportLatex = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export-latex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latexCode,
          resumeData,
          template,
          mode: activeTab,
          filename: `${exportOptions.filename}.tex`,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${exportOptions.filename}.tex`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsOpen(false);
      } else {
        console.error("LaTeX export failed");
      }
    } catch (error) {
      console.error("LaTeX export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-zinc-900 max-w-2xl w-full p-0 rounded-xl shadow-2xl">
        <div className="p-8 pb-0 border-b">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <Download className="w-6 h-6" />
            Export Resume
          </div>
        </div>
        <div className="w-full p-8 pt-4">
          <div className="grid w-full grid-cols-2 mb-8 rounded-lg overflow-hidden">
            <button className="flex items-center gap-2 text-lg font-semibold py-3 bg-muted" disabled>
              <FileText className="w-5 h-5" />
              PDF Export
            </button>
            <button className="flex items-center gap-2 text-lg font-semibold py-3" disabled>
              <Code className="w-5 h-5" />
              LaTeX Source
            </button>
          </div>
          {/* PDF Export Content */}
          <Card className="p-8 bg-muted/40 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6" />
              PDF Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="filename" className="text-base font-medium mb-1">Filename</Label>
                <Input
                  id="filename"
                  value={exportOptions.filename}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExportOptions({
                      ...exportOptions,
                      filename: e.target.value,
                    })
                  }
                  placeholder="resume"
                  className="text-base px-4 py-2"
                />
              </div>
              <div>
                <Label htmlFor="format" className="text-base font-medium mb-1">Paper Size</Label>
                <Select
                  id="format"
                  value={exportOptions.format}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportOptions({ ...exportOptions, format: e.target.value })}
                  className="text-base px-4 py-2"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="orientation" className="text-base font-medium mb-1">Orientation</Label>
                <Select
                  id="orientation"
                  value={exportOptions.orientation}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportOptions({ ...exportOptions, orientation: e.target.value })}
                  className="text-base px-4 py-2"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontSize" className="text-base font-medium mb-1">Font Size</Label>
                <Select
                  id="fontSize"
                  value={exportOptions.fontSize.toString()}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportOptions({ ...exportOptions, fontSize: Number.parseInt(e.target.value) })}
                  className="text-base px-4 py-2"
                >
                  <option value="9">9pt</option>
                  <option value="10">10pt</option>
                  <option value="11">11pt</option>
                  <option value="12">12pt</option>
                </Select>
              </div>
            </div>
            <div className="mt-6">
              <Label className="text-base font-medium mb-2">Margins (mm)</Label>
              <div className="grid grid-cols-4 gap-4 mt-2">
                <div>
                  <Label htmlFor="marginTop" className="text-xs">Top</Label>
                  <Input
                    id="marginTop"
                    type="number"
                    value={exportOptions.margins.top}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setExportOptions({
                        ...exportOptions,
                        margins: {
                          ...exportOptions.margins,
                          top: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="text-xs px-2 py-1"
                  />
                </div>
                <div>
                  <Label htmlFor="marginRight" className="text-xs">Right</Label>
                  <Input
                    id="marginRight"
                    type="number"
                    value={exportOptions.margins.right}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setExportOptions({
                        ...exportOptions,
                        margins: {
                          ...exportOptions.margins,
                          right: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="text-xs px-2 py-1"
                  />
                </div>
                <div>
                  <Label htmlFor="marginBottom" className="text-xs">Bottom</Label>
                  <Input
                    id="marginBottom"
                    type="number"
                    value={exportOptions.margins.bottom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setExportOptions({
                        ...exportOptions,
                        margins: {
                          ...exportOptions.margins,
                          bottom: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="text-xs px-2 py-1"
                  />
                </div>
                <div>
                  <Label htmlFor="marginLeft" className="text-xs">Left</Label>
                  <Input
                    id="marginLeft"
                    type="number"
                    value={exportOptions.margins.left}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setExportOptions({
                        ...exportOptions,
                        margins: {
                          ...exportOptions.margins,
                          left: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="text-xs px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </Card>
          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={() => setIsOpen(false)} className="rounded-full px-5 py-2 text-base font-medium">
              Cancel
            </Button>
            <Button
              onClick={exportPDF}
              disabled={isExporting}
              className="bg-primary hover:bg-primary/90 rounded-full px-5 py-2 text-base font-semibold"
            >
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
          {/* LaTeX Export Content */}
          <Card className="p-8 bg-muted/40 rounded-lg shadow-sm mt-8">
            <h3 className="text-xl font-bold mb-6">LaTeX Source Export</h3>
            <p className="text-muted-foreground mb-6 text-base">
              Export the LaTeX source code for your resume. You can compile this with any LaTeX distribution.
            </p>
            <div>
              <Label htmlFor="latexFilename" className="text-base font-medium mb-1">Filename</Label>
              <Input
                id="latexFilename"
                value={exportOptions.filename}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setExportOptions({
                    ...exportOptions,
                    filename: e.target.value,
                  })
                }
                placeholder="resume"
                className="text-base px-4 py-2"
              />
            </div>
          </Card>
          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={() => setIsOpen(false)} className="rounded-full px-5 py-2 text-base font-medium">
              Cancel
            </Button>
            <Button
              onClick={exportLatex}
              disabled={isExporting}
              className="bg-secondary hover:bg-secondary/90 rounded-full px-5 py-2 text-base font-semibold"
            >
              {isExporting ? "Exporting..." : "Export LaTeX"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
