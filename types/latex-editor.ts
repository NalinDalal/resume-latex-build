export interface LaTeXEditorProps {
  code: string;
  onChange: (code: string) => void;
  template?: string;
  resumeData?: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      website: string;
    };
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
    projects: any[];
  };
}
