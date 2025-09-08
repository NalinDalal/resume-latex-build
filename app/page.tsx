import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Code, Download, Palette } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumeBuilder</h1>
          </div>
          <Link href="/build">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Building
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
          Create Professional Resumes with{" "}
          <span className="text-blue-600">LaTeX Power</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
          Build stunning resumes using our intuitive form builder or write
          custom LaTeX code. Get real-time preview and export to PDF instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/build">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Start Building Now
            </Button>
          </Link>
          <Button className="text-lg px-8 py-3 bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50">
            View Examples
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Build Perfect Resumes
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 flex flex-col items-center">
            <Palette className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
            <p className="text-gray-600">Choose from modern, classic, creative, and minimal templates with customizable colors</p>
          </Card>
          <Card className="text-center p-6 flex flex-col items-center">
            <Code className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">LaTeX Editor</h3>
            <p className="text-gray-600">Write custom LaTeX code with syntax highlighting, auto-completion, and real-time compilation</p>
          </Card>
          <Card className="text-center p-6 flex flex-col items-center">
            <FileText className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Live Preview</h3>
            <p className="text-gray-600">See your resume update in real-time as you make changes to content or LaTeX code</p>
          </Card>
          <Card className="text-center p-6 flex flex-col items-center">
            <Download className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Export Options</h3>
            <p className="text-gray-600">Download as PDF with custom formatting or export LaTeX source code for further editing</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who trust our resume builder
          </p>
          <Link href="/build">
            <Button className="text-lg px-8 py-3 bg-white text-blue-600 border border-white hover:bg-blue-50">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-semibold">ResumeBuilder</span>
          </div>
          <p className="text-gray-400">
            Professional resume builder with LaTeX support
          </p>
        </div>
      </footer>
    </main>
  );
}
