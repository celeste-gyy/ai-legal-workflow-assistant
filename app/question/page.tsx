'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('请输入你的法律问题');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();

      // 将结果编码后传递给答案页
      const resultParam = encodeURIComponent(JSON.stringify(data));
      router.push(`/answer?result=${resultParam}`);
    } catch (err) {
      setError('获取回答失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-6">输入你的法律问题</h1>
      <textarea
        className="w-full max-w-2xl h-40 p-4 border rounded-lg text-black"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="例如：公司可以无理由辞退试用期员工吗？"
        disabled={loading}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '正在咨询 AI...' : '提交问题'}
      </button>
    </main>
  );
}