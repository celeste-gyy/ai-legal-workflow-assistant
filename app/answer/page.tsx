'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';

// 真正的内容组件（使用 useSearchParams）
function AnswerContent() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get('result');

  let result = {
    answer: '',
    riskLevel: '未知',
    legalBasis: [] as string[],
    needsHumanReview: false,
    humanReviewReason: '',
  };

  try {
    if (resultParam) {
      result = JSON.parse(decodeURIComponent(resultParam));
    }
  } catch (e) {
    console.error('解析结果失败');
  }

  const riskColor =
    result.riskLevel === '高' ? 'text-red-600' :
    result.riskLevel === '中高' ? 'text-orange-500' :
    result.riskLevel === '中' ? 'text-yellow-600' :
    'text-green-600';

  const [understood, setUnderstood] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">AI 回答与可信度评估</h1>

      {/* AI 回答 */}
      <div className="w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold mb-2">回答</h2>
        <div className="p-4 bg-blue-50 rounded border whitespace-pre-wrap">
          {result.answer || '未获取到回答'}
        </div>
      </div>

      {/* 风险等级 */}
      <div className="w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold mb-2">风险等级</h2>
        <span className={`text-2xl font-bold ${riskColor}`}>
          {result.riskLevel}
        </span>
      </div>

      {/* 法条依据 */}
      <div className="w-full max-w-3xl mb-6">
        <h3 className="text-lg font-medium mb-2">相关依据</h3>
        {result.legalBasis.length > 0 ? (
          <ul className="list-disc list-inside">
            {result.legalBasis.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">暂无具体法条</p>
        )}
      </div>

      {/* 人工复核提醒 */}
      {result.needsHumanReview && (
        <div className="w-full max-w-3xl mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="font-medium">⚠️ 建议人工复核</p>
          <p>{result.humanReviewReason}</p>
        </div>
      )}

      {/* 用户理解确认 */}
      <div className="w-full max-w-3xl p-4 border rounded-lg">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
          />
          <span>我理解 AI 回答不构成正式法律意见</span>
        </label>
        <Link
          href={understood ? '/confirm' : '#'}
          className={`mt-4 inline-block rounded-md px-6 py-3 text-white text-center w-full ${
            understood
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 pointer-events-none'
          }`}
        >
          确认
        </Link>
      </div>
    </main>
  );
}

// 外层包裹 Suspense（因为 useSearchParams 需要）
export default function AnswerPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">加载中...</div>}>
      <AnswerContent />
    </Suspense>
  );
}