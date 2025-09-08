import React, { useEffect, useState, useRef } from "react";

// This is a single-file Next.js page/component you can drop into app/page.tsx (Next 13+) or pages/index.tsx
// Uses Tailwind for styling (no imports required). It dynamically loads latex.js for LaTeX -> HTML compilation
// and html2pdf.js (via CDN) for a simple client-side PDF export. For production you may want a server-side
// LaTeX compiler (tectonic) or a wasm build for full fidelity PDFs.

export default function ResumeLatexBuilder() {
  const [template, setTemplate] = useState<"modern" | "classic">("modern");
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Software Engineer");
  const [email, setEmail] = useState("you@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [summary, setSummary] = useState(
    "A short, punchy professional summary.",
  );
  const [experience, setExperience] = useState([
    {
      role: "Frontend Engineer",
      company: "Acme",
      period: "2023 — Present",
      desc: "Built UI and components.",
    },
  ]);
  const [latex, setLatex] = useState("");
  const [compiledHtml, setCompiledHtml] = useState("");
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Build LaTeX from form fields
  useEffect(() => {
    const doc = generateLatexFromForm({
      name,
      title,
      email,
      phone,
      summary,
      experience,
      template,
    });
    setLatex(doc);
  }, [name, title, email, phone, summary, experience, template]);

  // Dynamically load latex.js and compile latex -> HTML for preview
  useEffect(() => {
    let mounted = true;
    async function compile() {
      try {
        // load latex.js if not present
        // latex.js (cdn) exposes window.latexjs
        // We'll dynamically import it from jsdelivr
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!window.latexjs) {
          await import(
            "https://cdn.jsdelivr.net/npm/latex.js/dist/latex.min.js"
          );
        }
        // eslint-disable-next-line @ts-ignore
        const latexjs = window.latexjs;
        if (latexjs && latex) {
          try {
            // convert to HTML
            const generator = new latexjs.HtmlGenerator({ hyphenate: false });
            latexjs.parse(latex, { generator });
            const html = generator.domFragment().innerHTML;
            if (mounted) setCompiledHtml(html);
          } catch (err) {
            if (mounted)
              setCompiledHtml(
                '<pre style="color:red">LaTeX compile error</pre>',
              );
          }
        }
      } catch (err) {
        if (mounted)
          setCompiledHtml(
            '<pre style="color:orange">Failed to load LaTeX compiler (cdn)</pre>',
          );
      }
    }
    compile();
    return () => {
      mounted = false;
    };
  }, [latex]);

  // Add / remove experiences
  function addExperience() {
    setExperience([
      ...experience,
      {
        role: "New Role",
        company: "Company",
        period: "Year — Year",
        desc: "Description",
      },
    ]);
  }
  function updateExperience(i: number, key: string, value: string) {
    const next = experience.slice();
    // @ts-ignore
    next[i][key] = value;
    setExperience(next);
  }
  function removeExperience(i: number) {
    setExperience(experience.filter((_, idx) => idx !== i));
  }

  // Download .tex file
  function downloadTex() {
    const blob = new Blob([latex], { type: "text/x-tex" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_resume.tex`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export PDF using html2pdf (client-side). This is a pragmatic approach — for production use server-side latex conversion.
  async function exportPdf() {
    // load html2pdf if needed
    // @ts-ignore
    if (!window.html2pdf) {
      await import(
        "https://cdn.jsdelivr.net/npm/html2pdf.js@0.9.3/dist/html2pdf.bundle.min.js"
      );
    }
    // @ts-ignore
    const opt = {
      margin: 10,
      filename: `${name.replace(/\s+/g, "_")}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    if (previewRef.current) {
      // create a container copy so we don't modify original formatting
      const node = previewRef.current.cloneNode(true) as HTMLElement;
      // small style reset
      node.style.background = "white";
      // @ts-ignore
      window.html2pdf().from(node).set(opt).save();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <header className="col-span-12 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">
            Resume Builder + LaTeX Editor
          </h1>
          <div className="flex gap-3">
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
            <button
              onClick={downloadTex}
              className="px-3 py-1 rounded bg-sky-600 text-white"
            >
              Download .tex
            </button>
            <button
              onClick={exportPdf}
              className="px-3 py-1 rounded bg-emerald-600 text-white"
            >
              Export PDF
            </button>
          </div>
        </header>

        {/* Left: form + latex editor */}
        <section className="col-span-5 bg-white rounded shadow p-4 space-y-4">
          <h2 className="font-semibold">Builder (form → LaTeX)</h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            <input
              className="border rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              className="border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              className="border rounded p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </div>

          <textarea
            className="w-full h-24 border rounded p-2"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <div>
            <h3 className="font-medium">Experience</h3>
            <div className="space-y-2 mt-2">
              {experience.map((exp, i) => (
                <div key={i} className="border rounded p-2 bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      className="border rounded p-1 flex-1"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(i, "role", e.target.value)
                      }
                    />
                    <input
                      className="border rounded p-1 flex-1"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(i, "company", e.target.value)
                      }
                    />
                    <input
                      className="border rounded p-1 w-32"
                      value={exp.period}
                      onChange={(e) =>
                        updateExperience(i, "period", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeExperience(i)}
                      className="px-2 bg-red-500 text-white rounded"
                    >
                      X
                    </button>
                  </div>
                  <textarea
                    className="w-full mt-2 border rounded p-1"
                    value={exp.desc}
                    onChange={(e) =>
                      updateExperience(i, "desc", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button
                onClick={addExperience}
                className="px-3 py-1 rounded bg-gray-800 text-white"
              >
                Add experience
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Raw LaTeX Editor</h3>
            <textarea
              className="w-full h-48 border rounded p-2 font-mono text-sm"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
            />
          </div>
        </section>

        {/* Right: preview */}
        <section className="col-span-7">
          <div className="bg-white rounded shadow h-full p-4" ref={previewRef}>
            <div className="flex justify-between items-start">
              <h2 className="font-semibold">Preview</h2>
              <div className="text-xs text-gray-500">
                Rendered from LaTeX using latex.js (client)
              </div>
            </div>
            <div
              className="mt-3 border rounded p-4 overflow-auto"
              style={{ minHeight: 600 }}
            >
              {/* compiledHtml is a string of HTML produced by latex.js */}
              <div dangerouslySetInnerHTML={{ __html: compiledHtml }} />
            </div>
          </div>
        </section>

        <footer className="col-span-12 text-sm text-gray-600 mt-4">
          Tip: For a production-quality PDF use a server-side LaTeX compiler
          (tectonic) or a wasm-based tool. This demo uses client-side tools for
          quick iteration.
        </footer>
      </div>
    </div>
  );
}

function generateLatexFromForm(data: any) {
  const { name, title, email, phone, summary, experience, template } = data;
  // A simple LaTeX template — tweak to taste. For production use more robust templating.
  const header = `\\documentclass[11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{left=1in,right=1in,top=1in,bottom=1in}
\\usepackage{hyperref}
\\begin{document}
`;
  const footer = "\\end{document}\n";
  const nameBlock = `\\begin{center}\\Huge{\\textbf{${escapeLatex(name)}}}\\\\ \\vspace{2mm} \\large{${escapeLatex(title)}}\\\\ \\normalsize ${escapeLatex(email)} ~|~ ${escapeLatex(phone)} \\end{center}\n\\vspace{4mm}\n`;
  const summaryBlock = `\\section*{Summary}
${escapeLatex(summary)}
`;
  const expBlock = `\\section*{Experience}
${experience
  .map(
    (
      e: any,
    ) => `\\textbf{${escapeLatex(e.role)}} -- ${escapeLatex(e.company)} \\hfill ${escapeLatex(e.period)}\\\\
${escapeLatex(e.desc)}\\\\[4pt]
`,
  )
  .join("\n")}
`;
  return header + nameBlock + summaryBlock + expBlock + footer;
}

function escapeLatex(s: string) {
  if (!s) return "";
  return s.replace(/([#$%&\\{}_^~])/g, "\\$1");
}
