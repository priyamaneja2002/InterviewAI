export const ROLE_OPTIONS = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'Product Manager',
    'DevOps Engineer',
    'UI/UX Designer'
]

export const EXPERIENCE_OPTIONS = [
    { value: 'fresher', label: 'Fresher (0-1 years)' },
    { value: 'junior', label: 'Junior (1-3 years)' },
    { value: 'mid', label: 'Mid-level (3-6 years)' },
    { value: 'senior', label: 'Senior (6+ years)' }
]

const getExperienceRequirements = (experienceLevel) => {
    const requirementsByLevel = {
        fresher: '0-1 years of internship, freelance, or project-based experience with evidence of practical execution.',
        junior: '1-3 years of professional experience shipping features, fixing production issues, and collaborating across teams.',
        mid: '3-6 years of proven ownership across planning, implementation, and measurable outcomes in production systems.',
        senior: '6+ years leading complex initiatives, mentoring teammates, and driving technical or product direction.'
    }

    return requirementsByLevel[experienceLevel] || requirementsByLevel.mid
}

const roleSpecificRequirements = {
    'Frontend Developer': {
        responsibilities: 'Build high-quality user interfaces and improve usability, performance, and accessibility across web applications.',
        skills: [
            'Strong proficiency in React and TypeScript, including component architecture, reusable state management patterns, and form handling.',
            'Deep understanding of web fundamentals (HTML, modern CSS, JavaScript), accessibility standards (WCAG), and cross-browser compatibility.',
            'Experience with performance tuning such as code-splitting, lazy loading, bundle analysis, and Core Web Vitals optimization.',
            'Comfort using API integration patterns, error boundaries, testing tools (Jest/RTL/Cypress), and frontend deployment workflows.'
        ]
    },
    'Backend Developer': {
        responsibilities: 'Design and maintain reliable backend services that power product features at scale.',
        skills: [
            'Strong command of Node.js/JavaScript backend development with clear API contracts, validation, and robust error handling.',
            'Practical experience with relational and/or NoSQL databases, schema design, query optimization, and transaction management.',
            'Knowledge of scalable architecture patterns including caching, async processing, rate limiting, and service observability.',
            'Hands-on familiarity with authentication/authorization, secure coding practices, and automated testing for APIs.'
        ]
    },
    'Full Stack Developer': {
        responsibilities: 'Own end-to-end feature delivery from user interface to backend service integration.',
        skills: [
            'Proficiency building frontend experiences in React and backend services in Node.js with clean integration boundaries.',
            'Ability to translate product requirements into scalable data models, APIs, and responsive UI flows.',
            'Experience with CI/CD, cloud deployment basics, logging/monitoring, and debugging full-stack issues in production.',
            'Understanding of testing strategy across layers, including unit, integration, and end-to-end test coverage.'
        ]
    },
    'Data Analyst': {
        responsibilities: 'Transform raw data into clear insights that influence product and business decisions.',
        skills: [
            'Advanced SQL proficiency for data extraction, transformation, and quality validation across multiple data sources.',
            'Practical Python/R skills for analysis automation, exploratory analysis, and reproducible reporting workflows.',
            'Experience building dashboards in BI tools (Power BI/Tableau/Looker) with clear KPIs and stakeholder-friendly narratives.',
            'Strong analytical communication skills to convert findings into recommendations, experiments, and action plans.'
        ]
    },
    'Data Scientist': {
        responsibilities: 'Develop and operationalize machine learning solutions that drive measurable business impact.',
        skills: [
            'Strong Python fundamentals and practical experience with ML libraries, feature engineering, model selection, and evaluation.',
            'Hands-on knowledge of experimentation design, statistical inference, and interpreting model performance trade-offs.',
            'Experience productionizing models through pipelines, monitoring drift, retraining strategies, and MLOps best practices.',
            'Ability to collaborate with engineering/product teams to scope feasible ML use-cases and communicate limitations clearly.'
        ]
    },
    'Product Manager': {
        responsibilities: 'Define product direction, prioritize roadmap outcomes, and align teams around customer value.',
        skills: [
            'Ability to convert ambiguous problems into clear product strategy, success metrics, and prioritized roadmaps.',
            'Strong user research and discovery skills, including interview synthesis, JTBD framing, and hypothesis-driven planning.',
            'Experience working with design and engineering teams to define requirements, manage trade-offs, and drive execution.',
            'Data fluency with product analytics, experimentation, and KPI tracking to inform iteration decisions.'
        ]
    },
    'DevOps Engineer': {
        responsibilities: 'Improve deployment reliability, infrastructure scalability, and platform observability.',
        skills: [
            'Deep experience with CI/CD systems, release automation, rollback strategies, and environment standardization.',
            'Strong cloud infrastructure expertise (AWS/GCP/Azure), including networking, compute, storage, and cost optimization.',
            'Hands-on skills in Infrastructure as Code (Terraform/CloudFormation), configuration management, and secret handling.',
            'Operational excellence in monitoring, alerting, incident response, and SRE practices for uptime and performance.'
        ]
    },
    'UI/UX Designer': {
        responsibilities: 'Design intuitive, accessible user experiences grounded in research and iterative validation.',
        skills: [
            'Strong user-centered design process from discovery to wireframes, high-fidelity prototypes, and usability validation.',
            'Proficiency in design systems, interaction patterns, visual hierarchy, and responsive design for web/mobile products.',
            'Experience running user research methods (interviews, task analysis, usability tests) and synthesizing actionable insights.',
            'Ability to collaborate closely with product and engineering teams to balance user needs, technical constraints, and timelines.'
        ]
    }
}

export const getDummyJdForSelection = (role, experienceLevel) => {
    if (!role || !experienceLevel) return ''

    const selectedRoleData = roleSpecificRequirements[role]
    const experienceLine = getExperienceRequirements(experienceLevel)

    const fallbackRoleData = {
        responsibilities: 'Contribute to high-impact product and engineering initiatives with a strong ownership mindset.',
        skills: [
            'Strong communication, collaboration, and problem-solving ability in cross-functional environments.',
            'Practical understanding of delivery lifecycle, quality standards, and continuous improvement practices.'
        ]
    }

    const roleData = selectedRoleData || fallbackRoleData

    return [
        `Role: ${role}`,
        '',
        'Company Overview:',
        'We are a fast-growing product team building reliable, user-focused digital solutions for a global customer base.',
        '',
        'Key Responsibilities:',
        `- ${roleData.responsibilities}`,
        '- Collaborate with cross-functional stakeholders to define, deliver, and iterate on impactful initiatives.',
        '- Contribute to process improvements, documentation standards, and overall team quality.',
        '',
        'Required Skills:',
        ...roleData.skills.map((skill) => `- ${skill}`),
        `- ${experienceLine}`,
        '',
        'Preferred:',
        '- Exposure to AI-enabled products, automation workflows, or data-informed decision processes.',
        '- Strong ownership mindset with attention to detail and continuous learning.'
    ].join('\n')
}
