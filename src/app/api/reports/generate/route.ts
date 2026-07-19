/* رافد — Reports Generate API */
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { period, platformId } = await request.json();
    const supabaseAdmin = createServiceClient();

    const now = new Date();
    const periodStart = new Date(now);
    if (period === 'weekly') periodStart.setDate(now.getDate() - 7);
    else periodStart.setMonth(now.getMonth() - 1);

    // Fetch issues in period
    let query = supabaseAdmin.from('issues').select('*').gte('created_at', periodStart.toISOString()).lte('created_at', now.toISOString());
    if (platformId) query = query.eq('platform_id', platformId);
    const { data: issues } = await query;
    const allIssues = issues || [];

    // Calculate stats
    const total = allIssues.length;
    const newCount = allIssues.filter((i) => i.status === 'new').length;
    const solved = allIssues.filter((i) => i.status === 'solved').length;
    const escalated = allIssues.filter((i) => i.status === 'escalated').length;

    // Wilaya breakdown
    const wilayaMap: Record<string, number> = {};
    allIssues.forEach((i) => { wilayaMap[i.wilaya] = (wilayaMap[i.wilaya] || 0) + 1; });

    // Category breakdown
    const catMap: Record<string, number> = {};
    allIssues.forEach((i) => { catMap[i.user_type] = (catMap[i.user_type] || 0) + 1; });

    const periodLabel = period === 'weekly' ? 'أسبوعي' : 'شهري';
    const title = `تقرير ${periodLabel} — ${periodStart.toLocaleDateString('ar-DZ')} إلى ${now.toLocaleDateString('ar-DZ')}`;

    const summary = `إجمالي ${total} انشغال خلال الفترة. تم حل ${solved} وتم رفع ${escalated}. نسبة الحل: ${total > 0 ? Math.round((solved / total) * 100) : 0}%.`;

    const { data: report, error } = await supabaseAdmin.from('reports').insert({
      title,
      period,
      period_start: periodStart.toISOString().split('T')[0],
      period_end: now.toISOString().split('T')[0],
      platform_id: platformId || null,
      total_issues: total,
      new_issues: newCount,
      solved_issues: solved,
      escalated_issues: escalated,
      wilaya_breakdown: wilayaMap,
      category_breakdown: catMap,
      summary,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
