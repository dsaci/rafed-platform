const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain';

const conversations = fs.readdirSync(brainDir);
let matchCount = 0;

conversations.forEach(conv => {
  const logPath = path.join(brainDir, conv, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
    lines.forEach(line => {
      if (!line) return;
      try {
        const obj = JSON.parse(line);
        if (obj.source === 'SYSTEM' && obj.content && obj.content.includes('File Path:')) {
          console.log('Found File Path response!');
          const pathMatch = obj.content.match(/File Path: `file:\/\/\/(.+?)`/);
          if (pathMatch) {
             console.log('Extracted path:', pathMatch[1]);
          } else {
             console.log('Regex failed on:', obj.content.substring(0, 100));
          }
        }
      } catch(e) {}
    });
  }
});
