'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  defaultLanguage,
  isLanguage,
  languageStorageKey,
  translations,
  type Language,
} from '@/lib/i18n';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const storedLanguage = localStorage.getItem(languageStorageKey);
  return isLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
}

export default function QuestionPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const router = useRouter();
  const t = translations[language];

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem(languageStorageKey, nextLanguage);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError(t.question.emptyError);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const messages = [{ role: 'user', content: question.trim() }];
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      const conversation = [
        ...messages,
        { role: 'assistant', content: JSON.stringify(data) },
      ];

      sessionStorage.setItem(
        'legal-ai-contract-workflow-conversation',
        JSON.stringify({ messages: conversation, result: data })
      );
      router.push('/answer');
    } catch {
      setError(t.question.requestError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-6 text-gray-950 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex justify-end">
          <LanguageSwitcher
            language={language}
            onChange={handleLanguageChange}
          />
        </div>
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {t.question.workflowLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{t.question.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.common.subtitle}</p>
          <textarea
            className="mt-6 h-40 w-full rounded-md border border-gray-300 p-4 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.question.placeholder}
            disabled={loading}
          />
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 rounded-md bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? t.question.loading : t.question.submit}
          </button>
        </section>
      </div>
    </main>
  );
}
