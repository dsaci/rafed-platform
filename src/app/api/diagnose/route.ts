/* رافد — AI Diagnosis API Route */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const SYSTEM_PROMPT = `أنت مساعد تقني متخصص حصرياً في المنصات الرقمية لوزارة التربية الوطنية الجزائرية.
منصاتك المعروفة: فضاء الأستاذ، منصة تقييم المكتسبات، منصة موظف، فضاء المؤسسة، فضاء الأولياء، الديوان الوطني للامتحانات، الامتحانات المهنية للرتب، مسابقات التوظيف، برامج الباك والبيام.
مهمتك:
1. تشخيص المشكلة بدقة
2. تقديم حل مفصل خطوة بخطوة باللغة العربية الواضحة
3. إذا كانت المشكلة تقنية لا حل لها من طرف المستخدم → اقترح رفعها للجهة المعنية
4. كن متعاطفاً، دقيقاً، عملياً
5. لا تذكر مصادر خارجية
6. ابدأ مباشرة بالتشخيص دون مقدمات طويلة
أجب دائماً بصيغة JSON:
{
  "diagnosis": "string",
  "solution_steps": ["string"],
  "confidence": "high | medium | low",
  "should_escalate": true/false,
  "escalation_reason": "string | null"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId, description, platformName, userType, wilaya } = body;

    if (!issueId || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // If no API key, mark as escalated
      const supabaseAdmin = createServiceClient();
      await supabaseAdmin.from('issues').update({
        status: 'escalated',
        ai_diagnosis: JSON.stringify({
          diagnosis: 'لم يتم تشخيص المشكلة بعد — سيتم مراجعتها يدوياً',
          solution_steps: [],
          confidence: 'low',
          should_escalate: true,
          escalation_reason: 'النظام الذكي غير متاح حالياً',
        }),
      }).eq('id', issueId);

      return NextResponse.json({ message: 'Escalated — no AI key configured' });
    }

    const userMessage = `المنصة: ${platformName}
نوع المستخدم: ${userType}
الولاية: ${wilaya}
وصف المشكلة: ${description}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiText = aiResponse.content?.[0]?.text || '';

    // Parse AI response
    let diagnosisData;
    try {
      diagnosisData = JSON.parse(aiText);
    } catch {
      diagnosisData = {
        diagnosis: aiText,
        solution_steps: [],
        confidence: 'medium',
        should_escalate: false,
        escalation_reason: null,
      };
    }

    // Update issue in database
    const supabaseAdmin = createServiceClient();
    const updateData: Record<string, string> = {
      ai_diagnosis: JSON.stringify(diagnosisData),
    };

    if (diagnosisData.should_escalate) {
      updateData.status = 'escalated';
      updateData.priority = 'high';
    } else {
      updateData.status = 'processing';
    }

    await supabaseAdmin.from('issues').update(updateData).eq('id', issueId);

    return NextResponse.json({ success: true, diagnosis: diagnosisData });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
