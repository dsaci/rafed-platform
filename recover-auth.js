const fs = require('fs');
const logPath = 'C:\\Users\\Surface\\.gemini\\antigravity\\brain\\e095467a-fa68-4680-a3d2-e1ece6060aeb\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
lines.forEach(line => {
    if(!line) return;
    try {
        const obj = JSON.parse(line);
        if (obj.content && typeof obj.content === 'string' && obj.content.includes('File Path:')) {
          const pathMatch = obj.content.match(/File Path: ile:\/\/\/(.+?)/i);
          if (pathMatch) {
            let filePath = decodeURIComponent(pathMatch[1]);
            if (filePath.toLowerCase().includes('rafed/src')) {
              const isFull = obj.content.includes('The above content shows the entire, complete file contents of the requested file.');
              const isPartial = obj.content.includes('The above content does NOT show the entire file contents');
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
                 fs.writeFileSync(filePath, extractedContent, 'utf8');
                 console.log('Restored auth file:', filePath);
              }
            }
          }
        }
    } catch(e) {}
});