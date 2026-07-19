import json

transcript_path = r"C:\Users\Surface\.gemini\antigravity\brain\fc573148-fa98-4c32-8e41-121c9c40a831\.system_generated\logs\transcript_full.jsonl"
found_globals = False

with open('extracted-globals.txt', 'w', encoding='utf-8') as out:
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if 'content' in data:
                content = data['content']
                if 'export default function RootLayout' not in content and '@tailwind base;' in content and not found_globals:
                    out.write("FOUND GLOBALS:\n")
                    out.write(content[:2000] + "\n\n")
                    found_globals = True
                    break