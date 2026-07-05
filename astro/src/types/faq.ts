export interface FAQ {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  id?: string;
  relatedServices?: string[];
  isFeatured?: boolean;
  order?: number;
  lastUpdated?: string;
}
