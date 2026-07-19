const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain';
const conversations = fs.readdirSync(brainDir);
const filesRecovered = {};

conversations.forEach(conv => {
  const logPath = path.join(brainDir, conv, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
    lines.forEach(line => {
      if (!line) return;
      try {
        const obj = JSON.parse(line);
        // Look for write_to_file or replace_file_content in PLANNER_RESPONSE
        if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
          obj.tool_calls.forEach(tc => { if(tc.name === 'write_to_file') { console.log('Found write: ', tc.args.TargetFile); }
            if (tc.name === 'write_to_file') {
              const filePath = tc.args.TargetFile;
              if (filePath && filePath.toLowerCase().includes('rafed/src')) {
                 filesRecovered[filePath.toLowerCase()] = tc.args.CodeContent;
              }
            }
          });
        }
      } catch(e) {}
    });
  }
});

console.log(`Found full contents for ${Object.keys(filesRecovered).length} files from write_to_file.`);
for (const [f, c] of Object.entries(filesRecovered)) {
  fs.writeFileSync(f, c, 'utf8');
  console.log('Restored from write: ' + f);
}
