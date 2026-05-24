import { NextResponse } from 'next/server';

type ClientMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(request: Request) {
  try {
    const { question, messages = [] } = await request.json();
    const conversationMessages: ClientMessage[] =
      Array.isArray(messages) && messages.length > 0
        ? messages
        : [{ role: 'user', content: question }];

    const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const deepseekModel = process.env.DEEPSEEK_MODEL;

    if (!deepseekBaseUrl || !deepseekApiKey || !deepseekModel) {
      console.error('DeepSeek 服务端环境变量未配置完整');
      return NextResponse.json(
        { error: 'AI 服务配置缺失，请检查服务端环境变量' },
        { status: 500 }
      );
    }

    const apiUrl = `${deepseekBaseUrl}/v1/chat/completions`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: deepseekModel,
        messages: [
          {
            role: 'system',
            content: `你是一名面向业务团队的 AI Legal Workflow Assistant，帮助进行法律风险初步识别、workflow routing 与法务升级分流。

你会收到多轮 conversation history。请基于全部历史动态更新 riskState，并返回严格JSON，格式如下：
{
  "answer": "法律回答（简明扼要，面向非专业人士；如果信息不足，请先提出需要补充的问题）",
  "riskLevel": "Low/Medium/High",
  "previousRiskLevel": "Low/Medium/High 或 null",
  "riskEscalated": true或false,
  "riskReasons": ["风险原因1", "风险原因2"],
  "missingInfo": ["仍需补充的信息1", "仍需补充的信息2"],
  "followUpQuestions": ["需要业务补充的问题1", "需要业务补充的问题2"],
  "escalationRequired": true或false,
  "workflowRoute": "例如 Data Compliance Review / Employment Law Review / Contract Review / General Legal Triage",
  "workflowRecommendation": "建议进入哪个业务或法务 workflow，是否提交法务 review",
  "uncertaintyNotes": ["目前信息不足或判断不确定的地方"],
  "legalBasis": ["相关法条1", "相关法条2"],
  "needsHumanReview": true或false,
  "humanReviewReason": "如需复核，给出简短理由"
}

要求：
- 只做初步法律风险识别，不替代法务、律师或公司最终决策。
- 必须结合完整 conversation history，而不是只看最后一条消息。
- previousRiskLevel 应来自上一轮 assistant JSON 中的 riskLevel；如果没有上一轮，返回 null。
- riskEscalated 表示本轮 riskLevel 是否高于 previousRiskLevel，例如 Medium 到 High 为 true。
- 如果事实不完整，不要直接输出最终结论；请写入 missingInfo、followUpQuestions 和 uncertaintyNotes，并在 answer 中提出 follow-up questions。
- missingInfo 至少覆盖适用项：客户地区、是否涉及个人信息、是否涉及敏感数据、是否跨境、合同责任范围。
- Workflow Routing 规则：NDA -> Contract Review；数据跨境 -> Data Compliance Review；海外客户 -> International Legal Review；自动续约 -> Commercial Contract Review。
- High Risk 或涉及个人信息、劳动争议、重大合同、监管处罚、诉讼、知识产权核心权利时，escalationRequired 和 needsHumanReview 应为 true，并建议人工法务介入。
- riskLevel 只能使用 Low、Medium、High。
- workflowRoute 使用清晰的企业流程名称。
不要返回任何其他内容，只返回JSON。`,
          },
          ...conversationMessages,
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
