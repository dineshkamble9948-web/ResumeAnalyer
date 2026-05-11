const jobSkills = {
  'web developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'REST API'],
  'software developer': ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'SQL', 'Git', 'Docker', 'AWS', 'Linux', 'Testing'],
  'AI engineer': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'NLP', 'Computer Vision', 'Deep Learning'],
  'data analyst': ['Python', 'R', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization'],
  'data scientist': ['Python', 'R', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'SQL', 'Statistics', 'Deep Learning'],
  'project manager': ['Agile', 'Scrum', 'Kanban', 'JIRA', 'Risk Management', 'Stakeholder Management', 'Budget Planning', 'Team Leadership'],
  'ux designer': ['Figma', 'Sketch', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems'],
  'backend developer': ['Node.js', 'Python', 'Java', 'C#', 'Database', 'SQL', 'MongoDB', 'REST API', 'Microservices', 'Docker'],
  'frontend developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'TypeScript', 'SASS', 'Webpack', 'Responsive Design'],
  'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Jenkins', 'Git', 'Linux', 'Monitoring', 'Terraform'],
  'qa engineer': ['Testing', 'Automation', 'Selenium', 'JIRA', 'Test Cases', 'Bug Tracking', 'Quality Assurance', 'Performance Testing'],
  'product manager': ['Product Strategy', 'Roadmap', 'Stakeholders', 'User Research', 'MVP', 'Agile', 'Scrum', 'Prioritization', 'KPIs'],
  'business analyst': ['Requirements Gathering', 'Process Improvement', 'Stakeholder Management', 'Data Analysis', 'UAT', 'Business Process'],
  'system administrator': ['Linux', 'Windows Server', 'Networking', 'Security', 'Active Directory', 'AWS', 'Azure', 'Backups', 'Monitoring'],
  'ios developer': ['Swift', 'Objective-C', 'iOS', 'Xcode', 'UIKit', 'SwiftUI', 'Mobile Development', 'Git', 'REST API', 'Core Data'],
  'android developer': ['Java', 'Kotlin', 'Android', 'Android Studio', 'Mobile Development', 'XML', 'REST API', 'Firebase', 'Git'],
  'mobile developer': ['Swift', 'Kotlin', 'React Native', 'Mobile Development', 'iOS', 'Android', 'Firebase', 'REST API']
};

function getSkillsForJob(jobTitle) {
  if (!jobTitle) return [];
  const titleLower = jobTitle.toLowerCase();
  for (let job in jobSkills) {
    if (titleLower.includes(job)) {
      return jobSkills[job];
    }
  }
  return jobSkills['web developer'];
}

function calculateATSScore(resume, jobRole) {
  let score = 0;
  const resume_lower = resume.toLowerCase();
  const wordCount = resume.split(/\s+/).filter(Boolean).length;

  if (wordCount < 100) return 15;
  if (wordCount > 100) score += 20;

  if (resume.includes('@')) score += 15;
  else if (resume.match(/\d{3}-\d{3}-\d{4}/)) score += 10;
  else return score + 10;

  if (resume.match(/linkedin\.com|github\.com|portfolio/i)) score += 10;
  else score -= 5;

  const requiredSections = ['experience', 'education', 'skills'];
  const foundRequired = requiredSections.filter(s => resume_lower.includes(s)).length;
  if (foundRequired < 2) return score + 5;
  score += foundRequired * 8;

  const actionVerbs = ['developed', 'implemented', 'created', 'designed', 'managed', 'led', 'improved', 'increased', 'achieved', 'built', 'deployed'];
  const verbCount = actionVerbs.filter(v => resume_lower.includes(v)).length;
  if (verbCount < 2) score -= 10;
  else score += Math.min(verbCount * 3, 15);

  const hasYears = resume.match(/\d{4}/g);
  if (!hasYears || hasYears.length < 2) score -= 15;
  else score += 10;

  return Math.max(Math.min(score, 100), 0);
}

function calculateKeywordMatch(resume, jobRole) {
  const keywords = getSkillsForJob(jobRole);
  const resume_lower = resume.toLowerCase();
  const matchedCount = keywords.filter(keyword => resume_lower.includes(keyword.toLowerCase())).length;
  const percentage = (matchedCount / keywords.length) * 100;
  if (percentage < 15) return Math.max(percentage - 20, 0);
  return Math.min(percentage, 100);
}

function calculateSkillsMatch(resume, jobRole) {
  return calculateKeywordMatch(resume, jobRole);
}

function calculateExperience(resume) {
  let score = 0;
  const resume_lower = resume.toLowerCase();
  const actionVerbs = ['developed', 'implemented', 'created', 'designed', 'managed', 'led', 'improved', 'increased', 'achieved', 'built', 'deployed'];
  const verbCount = actionVerbs.filter(v => resume_lower.includes(v)).length;
  score += Math.min(verbCount * 6, 30);

  const hasExperienceSection = /experience|work history|professional experience/i.test(resume);
  if (hasExperienceSection) score += 20;

  const yearMatches = resume.match(/\d{4}/g) || [];
  if (yearMatches.length >= 2) score += 30;
  else if (yearMatches.length === 1) score += 10;

  const titleKeywords = ['engineer', 'developer', 'manager', 'analyst', 'lead', 'consultant', 'specialist', 'architect'];
  const titleCount = titleKeywords.filter(t => resume_lower.includes(t)).length;
  score += Math.min(titleCount * 2, 20);

  return Math.max(Math.min(score, 100), 0);
}

function calculateEducation(resume) {
  let score = 0;
  const resume_lower = resume.toLowerCase();
  const hasEducation = /education|degree|bachelor|master|phd|associate|diploma/i.test(resume);
  if (hasEducation) score += 40;

  const institutionKeywords = ['university', 'college', 'institute', 'school', 'academy'];
  const institutionCount = institutionKeywords.filter(k => resume_lower.includes(k)).length;
  score += Math.min(institutionCount * 15, 30);

  if (/gpa|honors|distinction|cum laude|dean|scholarship/i.test(resume)) score += 20;

  return Math.max(Math.min(score, 100), 0);
}

function calculateProjects(resume) {
  let score = 0;
  const resume_lower = resume.toLowerCase();
  const hasProjects = /projects|portfolio|worked on|developed/i.test(resume);
  if (hasProjects) score += 30;

  const metrics = resume.match(/\d+%|\d+\+|increased|improved|achieved|reduced|grew|boosted/gi) || [];
  score += Math.min(metrics.length * 5, 35);

  const techKeywords = ['api', 'database', 'cloud', 'framework', 'library', 'module', 'component', 'algorithm', 'optimization', 'automation'];
  const techCount = techKeywords.filter(k => resume_lower.includes(k)).length;
  score += Math.min(techCount * 3, 35);

  return Math.max(Math.min(score, 100), 0);
}

function calculateKeywordsATS(resume, jobRole) {
  const keywordScore = calculateKeywordMatch(resume, jobRole);
  const atsScore = calculateATSScore(resume, jobRole);
  return Math.round((keywordScore * 0.6) + (atsScore * 0.4));
}

function calculateFormattingScore(resume) {
  let score = 0;
  const lines = resume.split('\n').filter(l => l.trim()).length;
  const wordCount = resume.split(/\s+/).filter(Boolean).length;

  if (lines < 5) return 10;
  if (lines < 10) score += 20;
  else if (lines < 20) score += 40;
  else score += 50;

  const specialChars = resume.match(/[^a-zA-Z0-9\s\-.,@()/:\n']/g) || [];
  const specialRatio = specialChars.length / wordCount;
  if (specialRatio > 0.15) score -= 30;
  else if (specialRatio > 0.08) score -= 15;
  else score += 10;

  const excessiveSpaces = (resume.match(/  +/g) || []).length;
  if (excessiveSpaces > 5) score -= 15;
  else score += 5;

  return Math.max(Math.min(score, 100), 0);
}

function calculateContentQuality(resume, jobLevel) {
  let score = 0;
  const resume_lower = resume.toLowerCase();
  const wordCount = resume.split(/\s+/).filter(Boolean).length;

  if (wordCount < 100) score += 5;
  else if (wordCount < 200) score += 20;
  else if (wordCount < 400) score += 40;
  else score += 50;

  const metrics = resume.match(/\d+%|\d+\+|increased|improved|achieved|reduced|grew|boosted/gi) || [];
  if (metrics.length < 1) score -= 20;
  else score += Math.min(metrics.length * 4, 25);

  const skillKeywords = ['proficient', 'experienced', 'expert', 'skilled', 'excellent', 'strong', 'proficiency'];
  const skillMatches = skillKeywords.filter(s => resume_lower.includes(s)).length;
  if (skillMatches > 0) score += Math.min(skillMatches * 3, 15);
  else score -= 10;

  const filler = (resume.match(/\b(very|really|good|nice|bad|thing|stuff|etc)\b/gi) || []).length;
  if (filler > 5) score -= 20;

  return Math.max(Math.min(score, 100), 0);
}

function calculateReadability(resume) {
  let score = 0;
  const lines = resume.split('\n').filter(l => l.trim()).length;
  const wordCount = resume.split(/\s+/).filter(Boolean).length;
  const avgLineLength = resume.length / Math.max(lines, 1);

  if (avgLineLength > 150) score += 20;
  else if (avgLineLength > 80) score += 35;
  else if (avgLineLength > 40) score += 45;
  else score += 10;

  const bulletPoints = (resume.match(/[-•*]\s/g) || []).length;
  if (bulletPoints < 3) score -= 20;
  else if (bulletPoints < 8) score += 20;
  else score += 35;

  const paragraphs = (resume.match(/\n\n/g) || []).length;
  if (paragraphs > 0) score += 15;
  if (lines < 2) score -= 50;

  return Math.max(Math.min(score, 100), 0);
}

function getReadinessLabel(score) {
  if (score >= 85) return 'Excellent — ATS-ready';
  if (score >= 70) return 'Good — strong resume';
  if (score >= 50) return 'Average — room to improve';
  return 'Needs improvement — update your resume';
}

function generateRecommendations(resume, jobTitle, foundSkills, missingSkills) {
  const recommendations = [];
  const resumeLower = resume.toLowerCase();
  if (!resume.includes('@') && !resume.match(/\d{3}-\d{3}-\d{4}/)) {
    recommendations.push('Add your email address and phone number at the top of your resume.');
  }
  if (!resumeLower.includes('experience')) {
    recommendations.push('Add an "Experience" section to highlight your work history.');
  }
  if (!resumeLower.includes('education')) {
    recommendations.push('Include an "Education" section with your degrees and institutions.');
  }
  if (!resumeLower.includes('skills')) {
    recommendations.push('Add a "Skills" section to list your technical abilities.');
  }
  if (missingSkills.length > 0 && jobTitle) {
    recommendations.push(`Consider adding these relevant skills for ${jobTitle}: ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  const words = resume.split(/\s+/).filter(Boolean).length;
  if (words < 100) {
    recommendations.push('Your resume seems short. Add more details about your experience and achievements.');
  }
  const bullets = (resume.match(/[-•*]\s/g) || []).length;
  if (bullets < 3) {
    recommendations.push('Use bullet points to make your resume easier to read.');
  }
  const actionVerbs = ['developed', 'created', 'managed', 'led', 'improved', 'designed'];
  const hasActionVerbs = actionVerbs.some(verb => resumeLower.includes(verb));
  if (!hasActionVerbs) {
    recommendations.push('Start bullet points with strong action verbs like "Developed", "Created", or "Managed".');
  }
  return recommendations.slice(0, 5);
}

function performAnalysis(jobTitle, resumeText) {
  const resumeLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const sections = ['experience', 'education', 'skills', 'projects', 'summary', 'certifications', 'achievements'];
  const sectionCount = sections.filter(section => resumeLower.includes(section)).length;

  const skills = getSkillsForJob(jobTitle);
  const foundSkills = skills.filter(skill => resumeLower.includes(skill.toLowerCase()));
  const missingSkills = skills.filter(skill => !resumeLower.includes(skill.toLowerCase()));

  const atsScore = calculateATSScore(resumeText, jobTitle);
  const keywordMatch = calculateKeywordMatch(resumeText, jobTitle);
  const formattingScore = calculateFormattingScore(resumeText);
  const contentQuality = calculateContentQuality(resumeText, 'mid');
  const readabilityScore = calculateReadability(resumeText);
  const skillsMatch = calculateSkillsMatch(resumeText, jobTitle);
  const experience = calculateExperience(resumeText);
  const education = calculateEducation(resumeText);
  const projects = calculateProjects(resumeText);
  const keywordsATS = calculateKeywordsATS(resumeText, jobTitle);
  const overallScore = Math.round(
    (skillsMatch * 0.3) +
    (experience * 0.2) +
    (education * 0.15) +
    (projects * 0.15) +
    (formattingScore * 0.1) +
    (keywordsATS * 0.1)
  );
  const skillScore = skills.length > 0 ? (foundSkills.length / skills.length) * 100 : 0;
  const readinessLabel = getReadinessLabel(overallScore);
  const recommendations = generateRecommendations(resumeText, jobTitle, foundSkills, missingSkills);

  return {
    wordCount,
    sectionCount,
    foundSkills,
    missingSkills,
    atsScore,
    keywordMatch: Math.round(keywordMatch),
    formattingScore,
    contentQuality,
    readabilityScore,
    skillScore: Math.round(skillScore),
    skillsMatch: Math.round(skillsMatch),
    experience: Math.round(experience),
    education: Math.round(education),
    projects: Math.round(projects),
    keywordsATS: Math.round(keywordsATS),
    overallScore,
    readinessLabel,
    recommendations
  };
}

module.exports = {
  performAnalysis
};

module.exports = {
  performAnalysis,
  getSkillsForJob,
  calculateATSScore,
  calculateKeywordMatch,
  calculateFormattingScore,
  calculateContentQuality,
  calculateReadability,
  generateRecommendations
};
