const { exec } = require('child_process');

const command = `npx eslint "src/**/*.{tsx,jsx,js}" --ignore-pattern "src/archive/**" -c .eslintrc.cjs -f json --output-file button-report.json`;

const eslintProcess = exec(command, (error, stdout, stderr) => {
  if (error && error.code !== 1) { // ESLint exits with 1 when linting errors are found
    console.error(`exec error: ${error}`);
    return;
  }
  
  // Even if ESLint finds errors, we want to generate the report.
  // The report generation script will handle the case where the file is empty or doesn't exist.
  
  const reportProcess = exec('node scripts/generate-a11y-report.cjs', (reportError, reportStdout, reportStderr) => {
    if (reportError) {
      console.error(`Report generation error: ${reportError}`);
      return;
    }
    if (reportStderr) {
      console.error(`Report generation stderr: ${reportStderr}`);
    }
    console.log(reportStdout);
  });
});

eslintProcess.stdout.on('data', (data) => {
  console.log(data);
});

eslintProcess.stderr.on('data', (data) => {
  console.error(data);
});