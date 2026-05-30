const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'button-report.json');
const reportOutputPath = path.join(process.cwd(), 'a11y-report.md');

if (!fs.existsSync(reportPath)) {
  console.log('ESLint report not found. Skipping accessibility report generation.');
  process.exit(0);
}

const eslintReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

const issuesByRule = {};
let totalIssues = 0;

eslintReport.forEach((fileReport) => {
  fileReport.messages.forEach((message) => {
    if (!issuesByRule[message.ruleId]) {
      issuesByRule[message.ruleId] = [];
    }
    issuesByRule[message.ruleId].push({
      filePath: fileReport.filePath,
      ...message,
    });
    totalIssues++;
  });
});

if (totalIssues === 0) {
  const markdownContent =
    '# Accessibility Report\n\n✅ No accessibility issues detected in the latest ESLint scan.';
  fs.writeFileSync(reportOutputPath, markdownContent);
  console.log('Accessibility Report updated — No issues found.');
  process.exit(0);
}

let markdownContent = '# Accessibility Report\n\n';

markdownContent += '## Summary\n\n';
markdownContent += '| Rule | Issues |\n';
markdownContent += '|------|--------|\n';
Object.keys(issuesByRule).forEach((ruleId) => {
  markdownContent += `| ${ruleId} | ${issuesByRule[ruleId].length} |\n`;
});
markdownContent += '\n';

markdownContent += '## Detailed Findings\n\n';

Object.keys(issuesByRule).forEach((ruleId) => {
  markdownContent += `### ${ruleId}\n\n`;
  issuesByRule[ruleId].forEach((issue) => {
    const relativePath = path.relative(process.cwd(), issue.filePath);
    markdownContent += `**File:** \`${relativePath}\`\n`;
    markdownContent += `**Location:** Line ${issue.line}, Column ${issue.column}\n`;
    markdownContent += `**Message:** ${issue.message}\n\n`;

    const fileContent = fs.readFileSync(issue.filePath, 'utf-8').split('\n');
    const startLine = Math.max(0, issue.line - 3);
    const endLine = Math.min(fileContent.length, issue.line + 2);
    const codeContext = fileContent.slice(startLine, endLine).join('\n');

    markdownContent += '```tsx\n';
    markdownContent += codeContext;
    markdownContent += '\n```\n\n';
  });
});

markdownContent += '## Proactive Fix Examples\n\n';
markdownContent += '### Buttons with accessible text\n\n';
markdownContent += '```tsx\n';
markdownContent += '// Bad\n';
markdownContent += '<button />\n\n';
markdownContent += '// Good\n';
markdownContent += '<button>Click Me</button>\n';
markdownContent += '<button aria-label="Close">X</button>\n';
markdownContent += '```\n\n';

markdownContent += '### Images with alt text\n\n';
markdownContent += '```tsx\n';
markdownContent += '// Bad\n';
markdownContent += '<img src="logo.png" />\n\n';
markdownContent += '// Good\n';
markdownContent += '<img src="logo.png" alt="Company Logo" />\n';
markdownContent += '```\n\n';

markdownContent += '### Anchors with content\n\n';
markdownContent += '```tsx\n';
markdownContent += '// Bad\n';
markdownContent += '<a></a>\n\n';
markdownContent += '// Good\n';
markdownContent += '<a href="/home">Home</a>\n';
markdownContent += '```\n\n';

fs.writeFileSync(reportOutputPath, markdownContent);

const ruleCount = Object.keys(issuesByRule).length;
console.log(
  `Accessibility Report updated — ${totalIssues} issues found across ${ruleCount} rules.`
);
