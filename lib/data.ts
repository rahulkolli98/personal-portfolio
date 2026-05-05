// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Experience {
  company: string;
  role: string;
  stack: string;
  period: string;
  location: string;
  logo?: string; // place your logo in /public/logos/<filename>
  bullets: string[];
}

export interface Project {
  name: string;
  slug: string;
  stack: string[];
  bullets: string[];
  imageSrc?: string;
  href?: string;
  githubUrl?: string;
  meta?: string;
  description?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ContactInfo {
  name: string;
  github: string;
  githubUrl: string;
  email: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contact: ContactInfo = {
  name: "Rahul Kolli",
  github: "rahulkolli98",
  githubUrl: "https://github.com/rahulkolli98",
  email: "", // add when ready to publish
};

// ─── Experience ───────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    company: "Eventzai",
    role: "Full Stack Developer",
    stack: "Flutter, PostgreSQL, Python, FastAPI, n8n, Docker, ElevenLabs, Gemini, Neo4j",
    period: "Apr 2024 – Present",
    location: "USA",
    logo: "/logos/eventzai.png",
    bullets: [
      "Built a production event platform — Flutter + FastAPI + PostgreSQL/Neo4j, serving thousands of concurrent users.",
      "Engineered a real-time voice AI system (ElevenLabs WebRTC) with dual-agent routing and auto transcript-to-profile extraction.",
      "Designed WebSocket chat, live transcript streaming, and Grafana-based observability across the full stack.",
      "Managed 100+ Alembic migrations and a Neo4j graph layer for AI-powered attendee matching.",
    ],
  },
  {
    company: "Blooph",
    role: "Full Stack Developer",
    stack: "Flutter, Node.js, Express, PostgreSQL, REST, AWS, Microservices, OAuth 2.0",
    period: "Jun 2023 – Mar 2024",
    location: "USA",
    logo: "/logos/blooph.png",
    bullets: [
      "Architected a 9-service microservices e-commerce platform covering users, catalog, orders, delivery, and payments.",
      "Designed a 40+ table PostgreSQL schema with Liquibase versioning and a centralized API Gateway.",
      "Integrated Stripe payments, coupon management, OTP auth, and role-based access in a Flutter mobile client.",
    ],
  },
  {
    company: "Dept of Education, Illinois Institute of Technology",
    role: "Data Admin — Chicago Public School Testing Project",
    stack: "Excel, Python, PowerBI, Tableau",
    period: "Aug 2023 – May 2024",
    location: "Illinois",
    logo: "/logos/iit.svg",
    bullets: [
      "Processed large-scale student attendance data with Python/Excel, improving accuracy by 20%.",
      "Coordinated test scheduling and materials for Chicago Public Schools admission testing.",
    ],
  },
  {
    company: "Accenture – CVS Health",
    role: "Associate Software Engineer",
    stack: "MS SQL, Azure DevOps, ETL, PySpark, IR Author, GitHub",
    period: "Sep 2020 – Aug 2022",
    location: "India",
    logo: "/logos/accenture.png",
    bullets: [
      "Tuned SQL Server queries and stored procedures for MedCompass, boosting responsiveness by 15%.",
      "Built PySpark ETL pipelines for real-time data integration and automated data validation scripts.",
      "Set up CI/CD with Azure DevOps, cutting deployment cycles by 50%.",
    ],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    name: "CodeForGood — Mesa Farm Volunteer App",
    slug: "codeforgood-mesa",
    stack: ["Flutter", "Node.js", "Express.js", "MySQL", "AWS Amplify"],
    imageSrc: "/projects/mesa1.jpg",
    href: "#",
    githubUrl: "https://github.com/rahulkolli98",
    meta: "Flutter • AWS Amplify",
    description: "A volunteer management platform built for Mesa Farm during a CodeForGood hackathon. Supports 800+ volunteers with onboarding, event management, and an admin dashboard.",
    bullets: [
      "Built volunteer onboarding system in Flutter/Dart for 800+ users with multi-step authentication (98% completion rate), profile setup, and role-based event access.",
      "Created admin dashboard with modular widgets for event creation, tracking 800+ volunteers, managing 50+ documents, and 99.5% uptime.",
      "Developed RESTful APIs using Node.js/Express connecting Flutter frontend to MySQL database, improving query performance by 40%.",
      "Migrated to AWS Amplify (70% faster deployments) with S3 file storage, Lambda functions, and CORS authentication via ngrok testing.",
    ],
  },
  {
    name: "Mood-Based Movie / Book Recommender",
    slug: "mood-recommender",
    stack: ["Next.js", "Python", "Hugging Face"],
    imageSrc: "/projects/movie-book-recommendation1.png",
    href: "#",
    githubUrl: "https://github.com/rahulkolli98",
    meta: "Next.js • Hugging Face",
    description: "A web app that recommends movies and books based on your current mood, powered by Hugging Face models and an adaptive recommendation algorithm.",
    bullets: [
      "Created web app recommending movies/books based on mood selection using an adaptive algorithm with Next.js and Hugging Face models.",
    ],
  },
  {
    name: "Restaurant Menu Decoder",
    slug: "menu-decoder",
    stack: ["Next.js", "Python", "OAuth", "Google Vision", "OCR", "MongoDB"],
    imageSrc: "/projects/menu-decoder1.png",
    href: "#",
    githubUrl: "https://github.com/rahulkolli98",
    meta: "Next.js • Google Vision",
    description: "A web app that uses Google Vision OCR to scan restaurant menus and instantly flag allergens and dietary restrictions — for the 32% of diners who spend 15+ minutes vetting menus.",
    bullets: [
      "Built Next.js web app for dietary restriction users with Zod validation on backend API routes, enhancing data security.",
      "Integrated Google Vision OCR and MongoDB for instant menu analysis, targeting 32% of diners who spend 15+ minutes vetting menus.",
      "Implemented error handling and logging systems ensuring reliable menu scanning with bold allergen labels for allergy-prone users.",
    ],
  },
  {
    name: "Shopping List Mobile App",
    slug: "shopping-list",
    stack: ["React Native", "Expo", "Supabase", "TypeScript", "OAuth"],
    imageSrc: "/projects/shopping list.png",
    href: "#",
    githubUrl: "https://github.com/rahulkolli98",
    meta: "React Native • Expo",
    description: "A collaborative mobile shopping list app with real-time sync, push notifications, and role-based access — built for iOS and Android with React Native, Expo, and Supabase.",
    bullets: [
      "Developed collaborative shopping list app with React Native/Expo and TypeScript, implementing real-time sync via Supabase for iOS/Android.",
      "Deployed push notification system using Supabase Edge Functions and Expo Push Service (95% delivery rate) for out-of-stock alerts.",
      "Built role-based access control (Owner/Editor/Member) with item status tracking and replacement workflows using PostgreSQL.",
    ],
  },
  {
    name: "OweMyGod",
    slug: "owemygod",
    stack: ["Next.js", "Node.js", "Express.js", "Supabase", "PostgreSQL"],
    imageSrc: "/projects/owemygod.png",
    href: "https://owemygod.com",
    githubUrl: "",
    meta: "Next.js • Express.js • Supabase • PostgreSQL",
    description: "A group expense tracker built because Splitwise's free plan wasn't cutting it. A Simple, Lovable, Complete 1.0 — no overengineering, just something that works.",
    bullets: [
      "Built because Splitwise's free plan limits expenses — expenses forgotten in the moment are expenses lost forever.",
      "A Simple, Lovable, Complete (SLC) 1.0 that solves the actual problem: tracking group expenses cleanly without overengineering.",
      "Implemented authentication, role-based access, and real-time balance tracking using Supabase/PostgreSQL and a Next.js frontend.",
      "Built with GitHub Copilot throughout — focused on practical tooling, real-world usability, and shipping fast over feature bloat.",
      "Roadmap includes Splitwise data import, percentage-based splits, and payment trigger integrations.",
    ],
  },
  {
    name: "Fake News Detection",
    slug: "fake-news-detection",
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    imageSrc: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
    href: "#",
    githubUrl: "https://github.com/rahulkolli98",
    meta: "Python • Scikit-learn",
    description: "A machine learning model that classifies news articles as real or fake with 85.08% accuracy using Random Forest and NLP techniques.",
    bullets: [
      "Created machine learning model classifying news articles with 85.08% accuracy using Random Forest, Scikit-learn, and evaluation via precision/recall/F1 score.",
    ],
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "Dart", "JavaScript", "TypeScript", "SQL", "HTML/CSS"],
  },
  {
    category: "Frameworks & Libraries",
    skills: ["Flutter", "React Native", "Next.js", "FastAPI", "Express.js", "Node.js", "PySpark"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Neo4j", "Supabase"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["AWS (Amplify, S3, Lambda)", "Azure DevOps", "Docker", "CI/CD Pipelines"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "GitHub", "VS Code", "Tableau", "Power BI", "OAuth 2.0", "RESTful APIs"],
  },
  {
    category: "AI / ML Tools",
    skills: ["OpenAI API", "ElevenLabs", "Gemini", "Hugging Face", "Pipecat", "Google Vision", "OCR"],
  },
  {
    category: "Architecture & Design",
    skills: [
      "Microservices Architecture",
      "Real-time Communication",
      "WebSocket Integration",
      "Graph Databases",
      "Event-driven Systems",
    ],
  },
];
