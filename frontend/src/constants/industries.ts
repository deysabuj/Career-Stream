export interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  featuredDomains: string[];
  popularSkills: string[];
  careerPaths: string[];
}

export interface DomainOption {
  id: string;
  name: string;
  industrySlug: string;
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'ind-tech',
    slug: 'technology',
    name: 'Technology & Software',
    description: 'Software development, cloud infrastructure, artificial intelligence, SaaS platforms, and digital tools.',
    iconName: 'Code',
    featuredDomains: ['Software Engineering', 'AI / ML', 'Cloud & DevOps', 'Cybersecurity', 'Web Development'],
    popularSkills: ['Python', 'Java', 'React', 'C++', 'AWS', 'Docker', 'Machine Learning'],
    careerPaths: ['Software Engineer Intern', 'Associate Software Engineer', 'Cloud Developer', 'AI/ML Trainee'],
  },
  {
    id: 'ind-finance',
    slug: 'finance',
    name: 'Banking, Finance & FinTech',
    description: 'Investment banking, digital payment solutions, risk advisory, Quantitative finance, and algorithmic trading.',
    iconName: 'Landmark',
    featuredDomains: ['Investment Banking', 'FinTech', 'Financial Analysis', 'Risk Management', 'Quantitative Finance'],
    popularSkills: ['Financial Modeling', 'SQL', 'Python', 'Excel', 'Risk Analysis', 'Statistics'],
    careerPaths: ['Financial Analyst Trainee', 'Investment Banking Analyst', 'FinTech Developer', 'Risk Analyst Intern'],
  },
  {
    id: 'ind-consulting',
    slug: 'consulting',
    name: 'Consulting & Professional Services',
    description: 'Management consulting, strategy advisory, technology transformation, audit, and tax consulting.',
    iconName: 'Briefcase',
    featuredDomains: ['Management Consulting', 'Strategy Advisory', 'IT Consulting', 'Tax & Audit', 'Risk Advisory'],
    popularSkills: ['Problem Solving', 'Data Analysis', 'PowerPoint', 'SQL', 'Financial Analysis', 'Business Strategy'],
    careerPaths: ['Associate Consultant', 'Technology Analyst', 'Audit Associate', 'Management Trainee'],
  },
  {
    id: 'ind-healthcare',
    slug: 'healthcare',
    name: 'Healthcare & Pharmaceuticals',
    description: 'Biotechnology, pharmaceutical research, medical devices, clinical trials, and health informatics.',
    iconName: 'HeartPulse',
    featuredDomains: ['Pharmaceutical Research', 'Biotechnology', 'Clinical Data Analysis', 'Health Informatics'],
    popularSkills: ['Biochemistry', 'Data Analysis', 'Python', 'Clinical Research', 'Regulatory Affairs'],
    careerPaths: ['Research Trainee', 'Clinical Data Associate', 'Biotech Intern', 'Pharma Analyst'],
  },
  {
    id: 'ind-retail',
    slug: 'retail',
    name: 'E-Commerce, Retail & FMCG',
    description: 'Consumer goods, digital commerce platforms, brand marketing, supply chain optimization, and retail operations.',
    iconName: 'ShoppingBag',
    featuredDomains: ['E-Commerce Platforms', 'Brand Marketing', 'Supply Chain & Operations', 'Category Management'],
    popularSkills: ['Digital Marketing', 'SQL', 'Supply Chain Analytics', 'Python', 'Market Research'],
    careerPaths: ['Management Trainee - FMCG', 'E-Commerce Analyst', 'Category Analyst Intern', 'Brand Associate'],
  },
  {
    id: 'ind-automotive',
    slug: 'automotive',
    name: 'Automotive & Industrial Manufacturing',
    description: 'EV engineering, smart manufacturing, robotics, structural design, and industrial automation.',
    iconName: 'Car',
    featuredDomains: ['EV & Battery Tech', 'Embedded Systems', 'Industrial Automation', 'Mechanical Design'],
    popularSkills: ['CAD/CAM', 'Embedded C', 'MATLAB', 'Python', 'Robotics', 'Mechatronics'],
    careerPaths: ['Graduate Engineer Trainee (GET)', 'Embedded Systems Engineer', 'EV Research Intern'],
  },
  {
    id: 'ind-telecom',
    slug: 'telecom',
    name: 'Telecommunications & Energy',
    description: '5G networking, satellite communication, renewable energy systems, grid analytics, and power generation.',
    iconName: 'Zap',
    featuredDomains: ['5G & Wireless Tech', 'Network Engineering', 'Renewable Energy', 'Power Analytics'],
    popularSkills: ['Networking', 'Python', 'Signal Processing', 'Linux', 'Power Systems'],
    careerPaths: ['Network Operations Trainee', 'Energy Data Analyst', 'Wireless Systems Intern'],
  },
  {
    id: 'ind-media',
    slug: 'media',
    name: 'Media, Entertainment & Gaming',
    description: 'Streaming services, game development, digital content creation, 3D graphics, and interactive media.',
    iconName: 'Film',
    featuredDomains: ['Game Development', 'Video Streaming Platforms', '3D Graphics & Animation', 'Content Strategy'],
    popularSkills: ['Unity/Unreal Engine', 'C++', 'Python', 'Motion Design', 'Video Editing', 'UI/UX'],
    careerPaths: ['Junior Game Developer', 'UI/UX Designer', 'Graphics Engineer Intern', 'Content Marketing Trainee'],
  },
  {
    id: 'ind-travel',
    slug: 'logistics',
    name: 'Travel, Hospitality & Logistics',
    description: 'Freight logistics, fleet management, travel booking engines, hotel operations, and warehouse automation.',
    iconName: 'Truck',
    featuredDomains: ['Warehouse Logistics', 'Fleet Optimization', 'Travel Tech Engines', 'Supply Chain Strategy'],
    popularSkills: ['Operations Research', 'SQL', 'Supply Chain Analytics', 'Python', 'Logistics Planning'],
    careerPaths: ['Logistics Trainee', 'Operations Analyst Intern', 'Supply Chain Executive'],
  },
  {
    id: 'ind-semiconductor',
    slug: 'semiconductor',
    name: 'Semiconductor & Hardware Tech',
    description: 'VLSI design, silicon validation, microchip fabrication, embedded firmware, and hardware engineering.',
    iconName: 'Cpu',
    featuredDomains: ['VLSI & ASIC Design', 'Embedded Firmware', 'Silicon Validation', 'Hardware Testing'],
    popularSkills: ['Verilog/VHDL', 'Embedded C', 'SystemVerilog', 'Python', 'Microcontrollers'],
    careerPaths: ['VLSI Design Engineer Trainee', 'Silicon Validation Engineer', 'Embedded Engineer Intern'],
  },
  {
    id: 'ind-edtech',
    slug: 'edtech',
    name: 'EdTech & Learning Solutions',
    description: 'Online learning platforms, adaptive assessment algorithms, educational content, and student analytics.',
    iconName: 'GraduationCap',
    featuredDomains: ['EdTech Platforms', 'Content Engineering', 'Student Analytics', 'Adaptive Learning'],
    popularSkills: ['React', 'Node.js', 'Python', 'Instructional Design', 'Data Analytics'],
    careerPaths: ['EdTech Developer Intern', 'Academic Content Associate', 'Product Management Analyst'],
  }
];

export const DOMAINS_LIST: DomainOption[] = [
  { id: 'dom-sw', name: 'Software Engineering', industrySlug: 'technology' },
  { id: 'dom-ai', name: 'AI / ML', industrySlug: 'technology' },
  { id: 'dom-cloud', name: 'Cloud & DevOps', industrySlug: 'technology' },
  { id: 'dom-sec', name: 'Cybersecurity', industrySlug: 'technology' },
  { id: 'dom-data', name: 'Data Analytics & Science', industrySlug: 'technology' },
  { id: 'dom-ib', name: 'Investment Banking', industrySlug: 'finance' },
  { id: 'dom-fintech', name: 'FinTech', industrySlug: 'finance' },
  { id: 'dom-finanalyst', name: 'Financial Analysis', industrySlug: 'finance' },
  { id: 'dom-risk', name: 'Risk Management', industrySlug: 'finance' },
  { id: 'dom-mgmtconsult', name: 'Management Consulting', industrySlug: 'consulting' },
  { id: 'dom-strat', name: 'Strategy Advisory', industrySlug: 'consulting' },
  { id: 'dom-taxaudit', name: 'Tax & Audit Consulting', industrySlug: 'consulting' },
  { id: 'dom-pharma', name: 'Pharmaceutical Research', industrySlug: 'healthcare' },
  { id: 'dom-biotech', name: 'Biotechnology', industrySlug: 'healthcare' },
  { id: 'dom-ecom', name: 'E-Commerce Platforms', industrySlug: 'retail' },
  { id: 'dom-fmcg', name: 'FMCG & Brand Marketing', industrySlug: 'retail' },
  { id: 'dom-ev', name: 'EV & Battery Tech', industrySlug: 'automotive' },
  { id: 'dom-embedded', name: 'Embedded Systems', industrySlug: 'automotive' },
  { id: 'dom-5g', name: '5G & Wireless Tech', industrySlug: 'telecom' },
  { id: 'dom-renewable', name: 'Renewable Energy', industrySlug: 'telecom' },
  { id: 'dom-gamedev', name: 'Game Development', industrySlug: 'media' },
  { id: 'dom-logistics', name: 'Supply Chain & Logistics', industrySlug: 'logistics' },
  { id: 'dom-vlsi', name: 'VLSI & Semiconductor', industrySlug: 'semiconductor' },
  { id: 'dom-edtech', name: 'EdTech & Learning', industrySlug: 'edtech' },
];

export const getIndustryBySlug = (slug?: string): Industry | undefined => {
  if (!slug) return undefined;
  return INDUSTRIES.find((ind) => ind.slug === slug.toLowerCase());
};
