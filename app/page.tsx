import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Building Now
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 bg-transparent"
          >
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
          <Card className="text-center">
            <CardHeader>
              <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Professional Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from modern, classic, creative, and minimal templates
                with customizable colors
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Code className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>LaTeX Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Write custom LaTeX code with syntax highlighting,
                auto-completion, and real-time compilation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See your resume update in real-time as you make changes to
                content or LaTeX code
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download as PDF with custom formatting or export LaTeX source
                code for further editing
              </CardDescription>
            </CardContent>
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
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
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
