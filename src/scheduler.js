const cron = require('node-cron');
const { exec } = require('child_process');

// Agenda a tarefa para rodar todos os dias à meia-noite
cron.schedule('0 0 * * *', () => {
  console.log('Running daily credit reset job...');
  exec('node src/jobs/resetCredits.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing job: ${error}`);
      return;
    }
    console.log(`Job output: ${stdout}`);
    if (stderr) {
      console.error(`Job error output: ${stderr}`);
    }
  });
});

console.log('Scheduler started.');
