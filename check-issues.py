import json

transcript_path = r"C:\Users\Surface\.gemini\antigravity\brain\fc573148-fa98-4c32-8e41-121c9c40a831\.system_generated\logs\transcript_full.jsonl"
found = False

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if 'content' in data:
            content = data['content']
            if 'src/app/issues/page.tsx' in content:
                print("FOUND IT!")
                found = True
                break
if not found:
    print("NOT FOUND")