export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoColor: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  salary: string;
  salaryMin: number;
  salaryMax: number;
  posted: string;
  postedDays: number;
  tags: string[];
  featured: boolean;
  urgent: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  experience: string;
  category: string;
  linkedinUrl: string;
  applicants: number;
  views: number;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Google",
    logo: "G",
    logoColor: "#4285F4",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹45L – ₹80L/yr",
    salaryMin: 4500000,
    salaryMax: 8000000,
    posted: "2 days ago",
    postedDays: 2,
    tags: ["React", "TypeScript", "Next.js", "GraphQL"],
    featured: true,
    urgent: false,
    description:
      "Join the Google Chrome team to build next-generation web experiences used by billions worldwide. You will architect and implement high-impact features while maintaining exceptional code quality.",
    requirements: [
      "5+ years React/TypeScript",
      "Strong CS fundamentals",
      "Experience with large-scale apps",
      "Performance optimization skills",
    ],
    benefits: [
      "Health insurance",
      "Stock options (RSU)",
      "Remote-friendly",
      "₹1.5L learning budget",
    ],
    experience: "5–8 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer+Google",
    applicants: 342,
    views: 5820,
  },
  {
    id: "2",
    title: "Product Manager — Growth",
    company: "Swiggy",
    logo: "S",
    logoColor: "#FC8019",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹30L – ₹55L/yr",
    salaryMin: 3000000,
    salaryMax: 5500000,
    posted: "1 day ago",
    postedDays: 1,
    tags: ["Product Strategy", "Analytics", "A/B Testing", "Growth"],
    featured: true,
    urgent: true,
    description:
      "Drive growth initiatives for Swiggy's core marketplace. Own key metrics and work cross-functionally with engineering, design and marketing teams to move the needle.",
    requirements: [
      "3+ years PM experience",
      "Data-driven mindset",
      "Startup experience",
      "Strong communication",
    ],
    benefits: ["Health insurance", "ESOPs", "Flexible hours", "Meal credits"],
    experience: "3–6 years",
    category: "Product",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Product+Manager+Growth+Swiggy",
    applicants: 189,
    views: 3200,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Razorpay",
    logo: "R",
    logoColor: "#3395FF",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹20L – ₹40L/yr",
    salaryMin: 2000000,
    salaryMax: 4000000,
    posted: "3 days ago",
    postedDays: 3,
    tags: ["Figma", "Design Systems", "Prototyping", "User Research"],
    featured: false,
    urgent: false,
    description:
      "Shape the future of payments UX at Razorpay. Design for millions of merchants and consumers across web and mobile platforms.",
    requirements: [
      "4+ years UX experience",
      "Figma mastery",
      "Portfolio required",
      "Fintech knowledge a plus",
    ],
    benefits: [
      "Health insurance",
      "ESOPs",
      "Remote work",
      "Design tools stipend",
    ],
    experience: "4–7 years",
    category: "Design",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=UI+UX+Designer+Razorpay",
    applicants: 97,
    views: 2100,
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Flipkart",
    logo: "F",
    logoColor: "#2874F0",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹25L – ₹50L/yr",
    salaryMin: 2500000,
    salaryMax: 5000000,
    posted: "5 days ago",
    postedDays: 5,
    tags: ["Python", "ML", "SQL", "TensorFlow", "Spark"],
    featured: false,
    urgent: false,
    description:
      "Build ML models powering recommendations, pricing, and demand forecasting for India's largest e-commerce platform. Drive data-driven decisions at massive scale.",
    requirements: [
      "MS/PhD relevant field",
      "Python & ML expertise",
      "Big data experience",
      "Strong statistics",
    ],
    benefits: ["Health insurance", "ESOPs", "Gym allowance", "Learning budget"],
    experience: "2–5 years",
    category: "Data",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Data+Scientist+Flipkart",
    applicants: 234,
    views: 4100,
  },
  {
    id: "5",
    title: "Backend Engineer (Node.js)",
    company: "CRED",
    logo: "C",
    logoColor: "#1C1C1C",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹30L – ₹60L/yr",
    salaryMin: 3000000,
    salaryMax: 6000000,
    posted: "1 week ago",
    postedDays: 7,
    tags: ["Node.js", "Microservices", "AWS", "PostgreSQL"],
    featured: false,
    urgent: true,
    description:
      "Build scalable backend systems for CRED's financial products. Work on high-performance services handling millions of daily transactions.",
    requirements: [
      "4+ years Node.js",
      "Microservices architecture",
      "AWS/GCP",
      "PostgreSQL/Redis",
    ],
    benefits: [
      "Health insurance",
      "ESOPs",
      "Remote work",
      "Work from anywhere 30d/yr",
    ],
    experience: "4–7 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Backend+Engineer+NodeJS+CRED",
    applicants: 156,
    views: 2890,
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Zomato",
    logo: "Z",
    logoColor: "#E23744",
    location: "Gurugram, India",
    type: "Full-time",
    salary: "₹22L – ₹45L/yr",
    salaryMin: 2200000,
    salaryMax: 4500000,
    posted: "2 days ago",
    postedDays: 2,
    tags: ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS"],
    featured: false,
    urgent: false,
    description:
      "Manage infrastructure for one of India's largest food delivery platforms. Ensure 99.99% uptime across thousands of microservices.",
    requirements: [
      "3+ years DevOps",
      "Kubernetes expert",
      "Infrastructure as code",
      "Strong Linux",
    ],
    benefits: ["Health insurance", "ESOPs", "Meal credits", "Learning budget"],
    experience: "3–6 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=DevOps+Engineer+Zomato",
    applicants: 88,
    views: 1740,
  },
  {
    id: "7",
    title: "Growth Marketing Manager",
    company: "Meesho",
    logo: "M",
    logoColor: "#9C27B0",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹18L – ₹35L/yr",
    salaryMin: 1800000,
    salaryMax: 3500000,
    posted: "4 days ago",
    postedDays: 4,
    tags: ["Performance Marketing", "SEO", "Analytics", "Meta Ads"],
    featured: false,
    urgent: false,
    description:
      "Drive user acquisition and retention for Meesho's social commerce platform. Own paid and organic channels to grow our 150M+ user base.",
    requirements: [
      "3+ years growth marketing",
      "Performance marketing",
      "Data-driven approach",
      "Social media",
    ],
    benefits: ["Health insurance", "ESOPs", "Flexible hours", "Remote work"],
    experience: "3–5 years",
    category: "Marketing",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Growth+Marketing+Manager+Meesho",
    applicants: 121,
    views: 2300,
  },
  {
    id: "8",
    title: "iOS Developer",
    company: "PhonePe",
    logo: "P",
    logoColor: "#5F259F",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹28L – ₹55L/yr",
    salaryMin: 2800000,
    salaryMax: 5500000,
    posted: "6 days ago",
    postedDays: 6,
    tags: ["Swift", "SwiftUI", "iOS", "Combine", "Core Data"],
    featured: false,
    urgent: false,
    description:
      "Build world-class iOS experiences for PhonePe's 500M+ users. Work on payments, investments, and insurance features at massive scale.",
    requirements: [
      "4+ years iOS",
      "Swift/SwiftUI expert",
      "App Store experience",
      "Performance optimization",
    ],
    benefits: [
      "Health insurance",
      "ESOPs",
      "Flexible hours",
      "Learning budget",
    ],
    experience: "4–7 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=iOS+Developer+PhonePe",
    applicants: 74,
    views: 1560,
  },
  {
    id: "9",
    title: "Full Stack Engineer",
    company: "Zepto",
    logo: "Z",
    logoColor: "#8B5CF6",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹20L – ₹40L/yr",
    salaryMin: 2000000,
    salaryMax: 4000000,
    posted: "3 days ago",
    postedDays: 3,
    tags: ["React", "Node.js", "MongoDB", "Redis", "Docker"],
    featured: false,
    urgent: false,
    description:
      "Build the technology behind India's fastest 10-minute grocery delivery. Work on high-scale, high-impact systems serving millions of orders daily.",
    requirements: [
      "3+ years full stack",
      "React & Node.js",
      "NoSQL databases",
      "System design",
    ],
    benefits: [
      "Health insurance",
      "ESOPs",
      "Free Zepto credits",
      "Flexible work",
    ],
    experience: "3–5 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Engineer+Zepto",
    applicants: 209,
    views: 3800,
  },
  {
    id: "10",
    title: "Machine Learning Engineer",
    company: "Ola",
    logo: "O",
    logoColor: "#16C181",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹32L – ₹65L/yr",
    salaryMin: 3200000,
    salaryMax: 6500000,
    posted: "1 day ago",
    postedDays: 1,
    tags: ["Python", "PyTorch", "MLOps", "Kubernetes", "GCP"],
    featured: true,
    urgent: false,
    description:
      "Develop ML systems for ride demand forecasting, driver matching, and dynamic pricing. Your models will impact millions of rides every day.",
    requirements: [
      "4+ years ML engineering",
      "PyTorch/TensorFlow",
      "MLOps experience",
      "Distributed systems",
    ],
    benefits: ["Health insurance", "ESOPs", "Cab credits", "Learning budget"],
    experience: "4–7 years",
    category: "Data",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Machine+Learning+Engineer+Ola",
    applicants: 178,
    views: 3200,
  },
  {
    id: "11",
    title: "Android Developer",
    company: "Paytm",
    logo: "P",
    logoColor: "#00BAF2",
    location: "Noida, India",
    type: "Full-time",
    salary: "₹18L – ₹38L/yr",
    salaryMin: 1800000,
    salaryMax: 3800000,
    posted: "4 days ago",
    postedDays: 4,
    tags: ["Kotlin", "Android", "Jetpack Compose", "MVVM"],
    featured: false,
    urgent: false,
    description:
      "Build Paytm's Android app used by 300M+ users. Work on payments, financial services, and commerce features with a focus on performance.",
    requirements: [
      "3+ years Android",
      "Kotlin mastery",
      "Jetpack Compose",
      "MVVM architecture",
    ],
    benefits: ["Health insurance", "ESOPs", "Paytm wallet credits", "WFH days"],
    experience: "3–6 years",
    category: "Engineering",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=Android+Developer+Paytm",
    applicants: 145,
    views: 2600,
  },
  {
    id: "12",
    title: "HR Business Partner",
    company: "Infosys",
    logo: "I",
    logoColor: "#007CC3",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹12L – ₹22L/yr",
    salaryMin: 1200000,
    salaryMax: 2200000,
    posted: "1 week ago",
    postedDays: 7,
    tags: ["HRBP", "Talent Management", "Employee Relations", "HR Analytics"],
    featured: false,
    urgent: false,
    description:
      "Partner with business leaders to drive HR strategy, talent development, and organisational effectiveness at one of India's largest IT companies.",
    requirements: [
      "5+ years HR experience",
      "HRBP experience",
      "MBA preferred",
      "Strong interpersonal skills",
    ],
    benefits: [
      "Health insurance",
      "Provident fund",
      "Employee discounts",
      "Learning programs",
    ],
    experience: "5–8 years",
    category: "HR",
    linkedinUrl:
      "https://www.linkedin.com/jobs/search/?keywords=HR+Business+Partner+Infosys",
    applicants: 67,
    views: 1200,
  },
];

export const categories = [
  { id: "1", name: "Engineering", icon: "⚙️", count: 5280, color: "#2563eb" },
  { id: "2", name: "Product", icon: "📦", count: 1240, color: "#7c3aed" },
  { id: "3", name: "Design", icon: "🎨", count: 892, color: "#db2777" },
  { id: "4", name: "Marketing", icon: "📢", count: 1560, color: "#d97706" },
  { id: "5", name: "Data", icon: "📊", count: 2100, color: "#059669" },
  { id: "6", name: "Sales", icon: "💼", count: 1890, color: "#0891b2" },
  { id: "7", name: "Finance", icon: "💰", count: 720, color: "#16a34a" },
  { id: "8", name: "HR", icon: "👥", count: 540, color: "#9333ea" },
];

export const companies = [
  {
    id: "1",
    name: "Google",
    logo: "G",
    color: "#4285F4",
    jobs: 24,
    industry: "Technology",
    founded: 1998,
  },
  {
    id: "2",
    name: "Microsoft",
    logo: "M",
    color: "#00A4EF",
    jobs: 31,
    industry: "Technology",
    founded: 1975,
  },
  {
    id: "3",
    name: "Amazon",
    logo: "A",
    color: "#FF9900",
    jobs: 58,
    industry: "E-commerce",
    founded: 1994,
  },
  {
    id: "4",
    name: "Flipkart",
    logo: "F",
    color: "#2874F0",
    jobs: 42,
    industry: "E-commerce",
    founded: 2007,
  },
  {
    id: "5",
    name: "Swiggy",
    logo: "S",
    color: "#FC8019",
    jobs: 19,
    industry: "Food Tech",
    founded: 2014,
  },
  {
    id: "6",
    name: "Zomato",
    logo: "Z",
    color: "#E23744",
    jobs: 27,
    industry: "Food Tech",
    founded: 2010,
  },
  {
    id: "7",
    name: "Razorpay",
    logo: "R",
    color: "#3395FF",
    jobs: 15,
    industry: "Fintech",
    founded: 2014,
  },
  {
    id: "8",
    name: "CRED",
    logo: "C",
    color: "#1C1C1C",
    jobs: 12,
    industry: "Fintech",
    founded: 2018,
  },
];

export const stats = [
  { label: "Active Jobs", value: "1,20,000+" },
  { label: "Companies", value: "15,000+" },
  { label: "Job Seekers", value: "50 Lakh+" },
  { label: "Placements", value: "8 Lakh+" },
];

export const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Senior Engineer at Google",
    avatar: "PS",
    quote:
      "PlanurJob helped me land my dream role at Google in 3 weeks. The AI resume matching was spot on — it showed me exactly which jobs fit my profile.",
    rating: 5,
  },
  {
    id: "2",
    name: "Arjun Mehta",
    role: "Product Manager at Swiggy",
    avatar: "AM",
    quote:
      "The resume upload feature is brilliant. I uploaded my CV and instantly got 40+ matched jobs. Got 4 interview calls in the first week.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sneha Reddy",
    role: "UX Designer at Razorpay",
    avatar: "SR",
    quote:
      'The LinkedIn "Apply Now" integration is seamless. One click and I was on the actual job listing. Landed my Razorpay offer through this site!',
    rating: 5,
  },
];

// Simple skill-to-job matching
export function matchJobsToResume(skills: string[], experience: string): Job[] {
  const skillLower = skills.map((s) => s.toLowerCase());

  return jobs
    .map((job) => {
      let score = 0;
      job.tags.forEach((tag) => {
        if (
          skillLower.some(
            (s) =>
              tag.toLowerCase().includes(s) || s.includes(tag.toLowerCase()),
          )
        ) {
          score += 2;
        }
      });
      job.requirements.forEach((req) => {
        if (skillLower.some((s) => req.toLowerCase().includes(s))) {
          score += 1;
        }
      });
      // Experience match
      const expYears = parseInt(experience || "0");
      const [minExp] = job.experience.split("–").map((e) => parseInt(e));
      if (expYears >= minExp - 1) score += 1;

      return { ...job, score };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .filter((j: any) => j.score > 0)
    .slice(0, 8) as Job[];
}
