const fs = require('fs');
const logPath = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain\\fc573148-fa98-4c32-8e41-121c9c40a831\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('view_file')) {
    console.log(lines[i].substring(0, 200));
    console.log(lines[i+1]?.substring(0, 500));
    break;
  }
}
