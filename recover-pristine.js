const fs = require('fs');
const logPaths = [
    'C:\\Users\\Surface\\.gemini\\antigravity\\brain\\09f2092f-1141-4e67-8383-c4ec333f3435\\.system_generated\\logs\\transcript_full.jsonl',
    'C:\\Users\\Surface\\.gemini\\antigravity\\brain\\ec81cbe3-94c5-4056-bd9f-74745adf2735\\.system_generated\\logs\\transcript_full.jsonl'
];
logPaths.forEach(logPath => {
    if(!fs.existsSync(logPath)) return;
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
                     // Let's check the extracted content
                     fs.writeFileSync(filePath, extractedContent, 'utf8');
                     console.log('Restored file:', filePath);
                  }
                }
              }
            }
        } catch(e) {}
    });
});