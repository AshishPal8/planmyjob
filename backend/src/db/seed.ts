import { db } from "./index";
import { skills, cities } from "./schema";

const SKILLS: string[] = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C", "C++",
  "C#", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R", "MATLAB",
  "Perl", "Bash", "PowerShell", "Lua", "Haskell", "Elixir", "Clojure",
  "F#", "Groovy", "Julia", "Assembly",

  // Frontend
  "React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte", "SvelteKit",
  "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "Material UI",
  "Chakra UI", "Ant Design", "Styled Components", "Redux", "Zustand",
  "Recoil", "MobX", "React Query", "SWR", "Webpack", "Vite", "Parcel",
  "Babel", "ESLint", "Prettier", "Storybook", "Framer Motion", "Three.js",
  "D3.js", "Chart.js", "WebGL",

  // Backend
  "Node.js", "Express.js", "Fastify", "NestJS", "Hono", "Django",
  "Flask", "FastAPI", "Spring Boot", "Spring MVC", "Laravel", "Symfony",
  "Ruby on Rails", "ASP.NET", "ASP.NET Core", "Gin", "Fiber", "Echo",
  "Actix", "Phoenix", "Ktor", "Micronaut", "Quarkus", "Deno", "Bun",

  // Databases
  "PostgreSQL", "MySQL", "SQLite", "MariaDB", "MongoDB", "Redis",
  "Elasticsearch", "Cassandra", "DynamoDB", "CouchDB", "Neo4j",
  "InfluxDB", "TimescaleDB", "Supabase", "Firebase", "PlanetScale",
  "Neon", "Turso", "Drizzle ORM", "Prisma", "TypeORM", "Sequelize",
  "Mongoose", "SQLAlchemy", "Hibernate",

  // Cloud & DevOps
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
  "Ansible", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
  "Travis CI", "ArgoCD", "Helm", "Prometheus", "Grafana", "Datadog",
  "New Relic", "Nginx", "Apache", "Linux", "Bash Scripting",
  "CloudFormation", "Pulumi", "Vercel", "Netlify", "Railway", "Render",
  "DigitalOcean", "Heroku",

  // Mobile
  "React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Ionic",
  "Xamarin", "Capacitor", "Expo", "Android Development", "iOS Development",

  // AI / ML / Data
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
  "Scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP", "LangChain",
  "LlamaIndex", "Hugging Face", "Stable Diffusion", "Data Analysis",
  "Data Visualization", "Tableau", "Power BI", "Apache Spark", "Hadoop",
  "Apache Kafka", "Apache Airflow", "dbt", "Snowflake", "BigQuery",

  // APIs & Protocols
  "REST API", "GraphQL", "gRPC", "WebSockets", "tRPC", "Swagger",
  "OpenAPI", "OAuth 2.0", "JWT", "SOAP", "WebRTC",

  // Testing
  "Jest", "Vitest", "Cypress", "Playwright", "Selenium", "Puppeteer",
  "Mocha", "Chai", "JUnit", "PyTest", "Testing Library",

  // Tools & Others
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Figma",
  "Postman", "Linux", "Microservices", "System Design", "Design Patterns",
  "Agile", "Scrum", "CI/CD", "Blockchain", "Solidity", "Web3.js", "Ethers.js",
  "Stripe", "Twilio", "SendGrid", "ImageKit", "Cloudinary", "Socket.io",
  "RabbitMQ", "Apache Kafka", "Celery",
];

const CITIES: { name: string; state: string }[] = [
  // Maharashtra
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Aurangabad", state: "Maharashtra" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Navi Mumbai", state: "Maharashtra" },

  // Karnataka
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Mysuru", state: "Karnataka" },
  { name: "Hubli", state: "Karnataka" },
  { name: "Mangaluru", state: "Karnataka" },
  { name: "Belagavi", state: "Karnataka" },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Salem", state: "Tamil Nadu" },

  // Telangana
  { name: "Hyderabad", state: "Telangana" },
  { name: "Warangal", state: "Telangana" },
  { name: "Secunderabad", state: "Telangana" },

  // Delhi NCR
  { name: "New Delhi", state: "Delhi" },
  { name: "Delhi", state: "Delhi" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Gurgaon", state: "Haryana" },
  { name: "Faridabad", state: "Haryana" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Greater Noida", state: "Uttar Pradesh" },

  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Meerut", state: "Uttar Pradesh" },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", state: "Gujarat" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Gandhinagar", state: "Gujarat" },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Kota", state: "Rajasthan" },

  // West Bengal
  { name: "Kolkata", state: "West Bengal" },
  { name: "Howrah", state: "West Bengal" },
  { name: "Durgapur", state: "West Bengal" },

  // Madhya Pradesh
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Gwalior", state: "Madhya Pradesh" },

  // Punjab
  { name: "Chandigarh", state: "Punjab" },
  { name: "Ludhiana", state: "Punjab" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Mohali", state: "Punjab" },

  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kochi", state: "Kerala" },
  { name: "Kozhikode", state: "Kerala" },
  { name: "Thrissur", state: "Kerala" },

  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Tirupati", state: "Andhra Pradesh" },
  { name: "Amaravati", state: "Andhra Pradesh" },

  // Bihar
  { name: "Patna", state: "Bihar" },
  { name: "Gaya", state: "Bihar" },

  // Jharkhand
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Dhanbad", state: "Jharkhand" },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Rourkela", state: "Odisha" },

  // Assam
  { name: "Guwahati", state: "Assam" },

  // Himachal Pradesh
  { name: "Shimla", state: "Himachal Pradesh" },

  // Uttarakhand
  { name: "Dehradun", state: "Uttarakhand" },

  // Haryana
  { name: "Ambala", state: "Haryana" },
  { name: "Hisar", state: "Haryana" },

  // Chhattisgarh
  { name: "Raipur", state: "Chhattisgarh" },

  // Remote
  { name: "Remote", state: "Anywhere" },
  { name: "Pan India", state: "India" },
];

const seed = async () => {
  console.log("Seeding skills...");
  const uniqueSkills = [...new Set(SKILLS)].map((name) => ({ name }));
  await db.insert(skills).values(uniqueSkills).onConflictDoNothing();
  console.log(`✓ Inserted ${uniqueSkills.length} skills`);

  console.log("Seeding cities...");
  await db.insert(cities).values(CITIES).onConflictDoNothing();
  console.log(`✓ Inserted ${CITIES.length} cities`);

  console.log("Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
