import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const apiUrl = `${process.env.DEEPSEEK_BASE_URL}/v1/chat/completions`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: `你是一名中国法律助手。请根据用户问题返回严格JSON，格式如下：
{
  "answer": "法律回答（简明扼要，面向非专业人士）",
  "riskLevel": "低/中/中高/高",
  "legalBasis": ["相关法条1", "相关法条2"],
  "needsHumanReview": true或false,
  "humanReviewReason": "如需复核，给出简短理由"
}
不要返回任何其他内容，只返回JSON。`,
          },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 返回错误：${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 解析模型返回的 JSON
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json(
      { error: 'AI 服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}