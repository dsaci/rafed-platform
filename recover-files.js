const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain';
const targetDir = 'c:\\Users\\Surface\\3D Objects\\Rafed\\src';

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
        if (obj.content && typeof obj.content === 'string' && obj.content.includes('File Path:')) {
          const pathMatch = obj.content.match(/File Path: `file:\/\/\/(.+?)`/i);
          if (pathMatch) {
            let filePath = decodeURIComponent(pathMatch[1]);
            // Normalize path to compare
            if (filePath.toLowerCase().includes('rafed/src')) {
              // Extract lines
              const isPartial = obj.content.includes('The above content does NOT show the entire file contents');
              const isFull = obj.content.includes('The above content shows the entire, complete file contents of the requested file.');
              
              if (isFull || isPartial) {
                 const linesData = obj.content.split('\n');
                 let extractedContent = '';
                 let capture = false;
                 for (let i = 0; i < linesData.length; i++) {
                   const l = linesData[i];
                   if (l.match(/^\d+:/)) {
                     capture = true;
                     extractedContent += l.replace(/^\d+:\s?/, '') + '\n';
                   } else if (capture && !l.match(/^\d+:/) && l !== 'The above content shows the entire, complete file contents of the requested file.' && !l.includes('The above content does NOT show the entire file contents')) {
                     capture = false;
                   }
                 }
                 if (isFull) {
                    filesRecovered[filePath.toLowerCase()] = extractedContent;
                 }
              }
            }
          }
        }
      } catch(e) {}
    });
  }
});

console.log(`Found full contents for ${Object.keys(filesRecovered).length} files.`);
for (const [f, c] of Object.entries(filesRecovered)) {
  fs.writeFileSync(f, c, 'utf8');
  console.log('Restored: ' + f);
}
