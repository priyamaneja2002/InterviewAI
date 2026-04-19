const dummyInterviewInput = {
    jobDescription: `
Frontend Developer (React.js)

Responsibilities:
- Build and maintain reusable UI components using React.
- Integrate REST APIs and handle client-side state.
- Collaborate with designers and backend developers.
- Write unit/integration tests and improve performance.

Requirements:
- 2+ years of JavaScript and React experience.
- Strong understanding of HTML, CSS, and responsive design.
- Familiarity with Git and basic CI/CD workflows.
- Good communication and problem-solving skills.
`.trim(),
    resume: `
Priyam Aneja
Email: priyam@example.com

Summary:
Frontend developer with internship and freelance experience building responsive web apps.

Skills:
- JavaScript, React, Node.js
- HTML5, CSS3, Tailwind CSS
- REST APIs, Git, Postman

Experience:
- Frontend Intern, ABC Tech (6 months)
  - Built dashboard screens in React and improved Lighthouse score by 20%.
  - Integrated authentication flow with cookies and protected routes.

Projects:
- AI Powered Job Helper
  - Built auth flow, route guards, and interview-prep UI components.
  - Connected frontend with Express backend APIs.
`.trim(),
    selfDescription: `
I am applying for a frontend role and I am comfortable with React fundamentals,
component-based architecture, routing, authentication flows, and API integration.
I want to improve in advanced React patterns, performance optimization, and test coverage.
My goal is to crack product-based company interviews in the next 2 months.
`.trim()
};

module.exports = {
    jobDescription: dummyInterviewInput.jobDescription,
    resume: dummyInterviewInput.resume,
    selfDescription: dummyInterviewInput.selfDescription,
};
