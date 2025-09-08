"use client";

import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Palette, Layout } from "lucide-react";
import { templates } from "@/lib/template-generator";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}


export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {Object.values(templates).map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer group transition-all duration-200 border-none shadow-sm hover:shadow-xl bg-card/90 hover:bg-card ring-0 hover:ring-2 hover:ring-primary/30 ${
              selectedTemplate === template.id
                ? "ring-2 ring-primary border-primary shadow-lg"
                : ""
            }`}
            onClick={() => onTemplateSelect(template.id)}
            tabIndex={0}
            aria-pressed={selectedTemplate === template.id}
          >
            <div className="p-6 flex flex-col gap-3">
              <div className="aspect-[3/4] mb-2 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-0.5 tracking-tight">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2 min-h-[2.5em]">
                {template.description}
              </p>

              {/* Template Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: `#${template.colors.primary}` }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{
                        backgroundColor: `#${template.colors.secondary}`,
                      }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: `#${template.colors.accent}` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {template.packages.includes("xcolor") && (
                    <Badge className="text-xs px-2 py-0.5">
                      Colors
                    </Badge>
                  )}
                  {template.packages.includes("hyperref") && (
                    <Badge className="text-xs px-2 py-0.5">
                      Links
                    </Badge>
                  )}
                  {template.packages.includes("fontspec") && (
                    <Badge className="text-xs px-2 py-0.5">
                      Fonts
                    </Badge>
                  )}
                  {template.packages.includes("tikz") && (
                    <Badge className="text-xs px-2 py-0.5">
                      Graphics
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Template Details */}
      {selectedTemplate && templates[selectedTemplate] && (
        <Card className="p-6 bg-muted/70 border-none shadow-sm mt-4">
          <h4 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Template Details: {templates[selectedTemplate].name}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h5 className="font-medium text-foreground mb-1">Document Class</h5>
              <p className="text-muted-foreground">
                {templates[selectedTemplate].documentClass}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-foreground mb-1">Margins</h5>
              <p className="text-muted-foreground">
                {templates[selectedTemplate].layout.margins}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-foreground mb-1">Packages</h5>
              <p className="text-muted-foreground">
                {templates[selectedTemplate].packages.length} LaTeX packages
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              This template uses <strong>{templates[selectedTemplate].packages.join(", ")}</strong> packages for enhanced formatting and styling.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
