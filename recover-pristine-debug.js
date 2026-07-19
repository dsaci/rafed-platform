const fs = require('fs');
const logPath = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain\\09f2092f-1141-4e67-8383-c4ec333f3435\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
lines.forEach(line => {
    if(!line) return;
    try {
        const obj = JSON.parse(line);
        if (obj.content && typeof obj.content === 'string' && obj.content.includes('File Path:')) {
          const idx = obj.content.indexOf('File Path:');
          console.log(obj.content.substring(idx, idx + 100));
        }
    } catch(e) {}
});