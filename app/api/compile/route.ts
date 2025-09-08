import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { latex, filename } = await req.json();

    // write temp .tex file
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "latex-"));
    const texFile = path.join(tmpDir, "doc.tex");
    await fs.writeFile(texFile, latex, "utf8");

    // run tectonic to compile .tex -> .pdf
    await execAsync(`tectonic ${texFile}`, { cwd: tmpDir });

    const pdfPath = texFile.replace(/\\.tex$/, ".pdf");
    const pdfBuffer = await fs.readFile(pdfPath);

    // clean up optional
    // await fs.rm(tmpDir, { recursive: true, force: true });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename || "resume.pdf"}\"`,
      },
    });
  } catch (e: any) {
    console.error("LaTeX compile error", e);
    return NextResponse.json(
      { error: "Compilation failed", details: String(e) },
      { status: 500 },
    );
  }
}
