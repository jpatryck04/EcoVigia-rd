export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  hasForm: boolean;
  details?: string;
  requirements?: string[];
  process?: Array<{
    step: string;
    title: string;
    description: string;
    duration: string;
  }>;
  processTime?: string;
  requiredDocuments?: string[];
}

export interface Procedure {
  id: number;
  step: string;
  title: string;
  description: string;
  requirements?: string[];
}