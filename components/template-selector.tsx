"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.values(templates).map((template) => (
          <Card
            key={template.id}
            className={`relative cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? "ring-2 ring-primary border-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="p-4">
              <div className="aspect-[3/4] mb-3 rounded-md overflow-hidden bg-muted">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {template.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {template.description}
              </p>

              {/* Template Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-3 h-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: `#${template.colors.primary}` }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{
                        backgroundColor: `#${template.colors.secondary}`,
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: `#${template.colors.accent}` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.packages.includes("xcolor") && (
                    <Badge variant="secondary" className="text-xs">
                      Colors
                    </Badge>
                  )}
                  {template.packages.includes("hyperref") && (
                    <Badge variant="secondary" className="text-xs">
                      Links
                    </Badge>
                  )}
                  {template.packages.includes("fontspec") && (
                    <Badge variant="secondary" className="text-xs">
                      Fonts
                    </Badge>
                  )}
                  {template.packages.includes("tikz") && (
                    <Badge variant="secondary" className="text-xs">
                      Graphics
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Template Details */}
      {selectedTemplate && templates[selectedTemplate] && (
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Template Details: {templates[selectedTemplate].name}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h5 className="font-medium text-foreground mb-1">
                Document Class
              </h5>
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

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This template uses{" "}
              <strong>{templates[selectedTemplate].packages.join(", ")}</strong>{" "}
              packages for enhanced formatting and styling.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
