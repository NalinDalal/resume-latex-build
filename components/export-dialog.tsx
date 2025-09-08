"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Code, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Resume
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PDF Export
            </TabsTrigger>
            <TabsTrigger value="latex" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              LaTeX Source
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                PDF Options
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filename">Filename</Label>
                  <Input
                    id="filename"
                    value={exportOptions.filename}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        filename: e.target.value,
                      })
                    }
                    placeholder="resume"
                  />
                </div>

                <div>
                  <Label htmlFor="format">Paper Size</Label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value) =>
                      setExportOptions({ ...exportOptions, format: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select
                    value={exportOptions.orientation}
                    onValueChange={(value) =>
                      setExportOptions({ ...exportOptions, orientation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={exportOptions.fontSize.toString()}
                    onValueChange={(value) =>
                      setExportOptions({
                        ...exportOptions,
                        fontSize: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9pt</SelectItem>
                      <SelectItem value="10">10pt</SelectItem>
                      <SelectItem value="11">11pt</SelectItem>
                      <SelectItem value="12">12pt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label>Margins (mm)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label htmlFor="marginTop" className="text-xs">
                      Top
                    </Label>
                    <Input
                      id="marginTop"
                      type="number"
                      value={exportOptions.margins.top}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          margins: {
                            ...exportOptions.margins,
                            top: Number.parseInt(e.target.value),
                          },
                        })
                      }
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marginRight" className="text-xs">
                      Right
                    </Label>
                    <Input
                      id="marginRight"
                      type="number"
                      value={exportOptions.margins.right}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          margins: {
                            ...exportOptions.margins,
                            right: Number.parseInt(e.target.value),
                          },
                        })
                      }
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marginBottom" className="text-xs">
                      Bottom
                    </Label>
                    <Input
                      id="marginBottom"
                      type="number"
                      value={exportOptions.margins.bottom}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          margins: {
                            ...exportOptions.margins,
                            bottom: Number.parseInt(e.target.value),
                          },
                        })
                      }
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marginLeft" className="text-xs">
                      Left
                    </Label>
                    <Input
                      id="marginLeft"
                      type="number"
                      value={exportOptions.margins.left}
                      onChange={(e) =>
                        setExportOptions({
                          ...exportOptions,
                          margins: {
                            ...exportOptions.margins,
                            left: Number.parseInt(e.target.value),
                          },
                        })
                      }
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={exportPDF}
                disabled={isExporting}
                className="bg-primary hover:bg-primary/90"
              >
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="latex" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                LaTeX Source Export
              </h3>
              <p className="text-muted-foreground mb-4">
                Export the LaTeX source code for your resume. You can compile
                this with any LaTeX distribution.
              </p>

              <div>
                <Label htmlFor="latexFilename">Filename</Label>
                <Input
                  id="latexFilename"
                  value={exportOptions.filename}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      filename: e.target.value,
                    })
                  }
                  placeholder="resume"
                />
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={exportLatex}
                disabled={isExporting}
                className="bg-secondary hover:bg-secondary/90"
              >
                {isExporting ? "Exporting..." : "Export LaTeX"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
