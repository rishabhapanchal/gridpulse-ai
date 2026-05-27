// src/data/articles.ts

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string; // You can use markdown text here later
  date: string;
  image: string;
}

export const articlesData: Article[] = [
  {
    id: "pm-surya-ghar-subsidy-guide",
    title: "Step-by-Step Guide: How to Track Your PM Surya Ghar Application Status",
    description: "Learn how to navigate the national solar portal, track your approval stages, and avoid common processing delays.",
    date: "2026-05-27",
    image: "/images/blog/subsidy-guide.jpg",
    content: "Full long-form body content of your article goes here..."
  },
  {
    id: "commercial-solar-payback-period",
    title: "Is a 3kW Solar Rooftop System Enough for a 4-Bedroom House?",
    description: "An engineering breakdown of monthly unit consumption versus solar generation metrics for residential setups.",
    date: "2026-05-25",
    image: "/images/blog/3kw-system.jpg",
    content: "Full long-form body content of your article goes here..."
  }
  // You will easily stack your 20-30 articles here as objects!
];
