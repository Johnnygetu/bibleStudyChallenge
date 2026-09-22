const fs = require('fs');
const lines = fs.readFileSync('/home/johnny/.gemini/antigravity-ide/brain/131f04e4-b910-4224-981a-d14e2bb0faa6/.system_generated/logs/transcript_full.jsonl', 'utf-8').split('\n');
let maxLines = 0;
let bestContent = '';
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes('export function TodayScreen')) {
      const lineCount = obj.content.split('\n').length;
      if (lineCount > maxLines) {
        maxLines = lineCount;
        bestContent = obj.content;
      }
    }
    
    if (obj.tool_calls) {
        for (const call of obj.tool_calls) {
            if (call.name === 'default_api:write_to_file' && call.arguments && call.arguments.TargetFile && call.arguments.TargetFile.includes('TodayScreen.tsx')) {
                const lineCount = call.arguments.CodeContent.split('\n').length;
                if (lineCount > maxLines) {
                    maxLines = lineCount;
                    bestContent = call.arguments.CodeContent;
                }
            }
        }
    }
  } catch (e) {}
}
console.log("Max lines found:", maxLines);
fs.writeFileSync('recovered_TodayScreen.tsx', bestContent);
