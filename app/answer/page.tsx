'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import RiskPanel from '@/components/RiskPanel';
import type { RiskLayerData, RiskLevel } from '@/components/RiskLayer';
import {
  defaultLanguage,
  isLanguage,
  languageStorageKey,
  translations,
  type Language,
  type Translation,
} from '@/lib/i18n';

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AnswerResult = {
  answer: string;
  riskLevel: string;
  previousRiskLevel?: string | null;
  riskEscalated?: boolean;
  riskReasons?: string[];
  missingInfo?: string[];
  followUpQuestions?: string[];
  escalationRequired?: boolean;
  workflowRoute?: string;
  workflowRecommendation?: string;
  uncertaintyNotes?: string[];
  legalBasis?: string[];
  needsHumanReview?: boolean;
  humanReviewReason?: string;
};

type StoredConversation = {
  messages: ConversationMessage[];
  result: AnswerResult;
  isMock?: boolean;
};

type PageState = {
  messages: ConversationMessage[];
  result: AnswerResult;
  language: Language;
  usingMock: boolean;
};

const storageKey = 'legal-ai-contract-workflow-conversation';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const storedLanguage = localStorage.getItem(languageStorageKey);
  return isLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
}

function normalizeRiskLevel(riskLevel?: string | null): RiskLevel {
  if (riskLevel === 'High' || riskLevel === '高' || riskLevel === '中高') {
    return 'High';
  }

  if (riskLevel === 'Medium' || riskLevel === '中') {
    return 'Medium';
  }

  return 'Low';
}

function parseAssistantContent(content: string): AnswerResult | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function buildMockConversation(t: Translation): StoredConversation {
  const result: AnswerResult = {
    answer: t.mock.assistant,
    riskLevel: 'High',
    previousRiskLevel: 'Medium',
    riskEscalated: true,
    riskReasons: [...t.mock.riskReasons],
    missingInfo: [...t.mock.missingInfo],
    followUpQuestions: [...t.mock.missingInfo],
    escalationRequired: true,
    workflowRoute: t.mock.workflowRoute,
    workflowRecommendation: t.risk.defaultRecommendationEscalate,
    uncertaintyNotes: [...t.mock.missingInfo],
    legalBasis: [...t.mock.legalBasis],
    needsHumanReview: true,
    humanReviewReason: t.mock.humanReviewReason,
  };

  return {
    messages: [
      { role: 'user', content: t.mock.user },
      {
        role: 'assistant',
        content: JSON.stringify({
          answer: t.mock.initialAssistant,
          riskLevel: 'Medium',
          previousRiskLevel: null,
          riskEscalated: false,
          riskReasons: [t.mock.riskReasons[0]],
          missingInfo: [...t.mock.missingInfo],
          followUpQuestions: [...t.mock.missingInfo],
          escalationRequired: false,
          workflowRoute: t.risk.defaultRouteHigh,
          workflowRecommendation: t.risk.defaultRecommendationNormal,
          uncertaintyNotes: [...t.mock.missingInfo],
          legalBasis: [],
          needsHumanReview: false,
          humanReviewReason: '',
        }),
      },
      { role: 'user', content: t.mock.followUpUser },
      { role: 'assistant', content: JSON.stringify(result) },
    ],
    result,
    isMock: true,
  };
}

function readInitialState(resultParam: string | null, t: Translation): StoredConversation {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(storageKey);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }
  }

  if (resultParam) {
    try {
      return {
        messages: [],
        result: JSON.parse(decodeURIComponent(resultParam)),
      };
    } catch {
      console.error('解析结果失败');
    }
  }

  return buildMockConversation(t);
}

function buildRiskLayer(result: AnswerResult, t: Translation): RiskLayerData {
  const riskLevel = normalizeRiskLevel(result.riskLevel);
  const previousRiskLevel = result.previousRiskLevel
    ? normalizeRiskLevel(result.previousRiskLevel)
    : null;
  const escalationRequired =
    result.escalationRequired ?? result.needsHumanReview ?? riskLevel === 'High';

  return {
    riskLevel,
    previousRiskLevel,
    riskEscalated: result.riskEscalated ?? false,
    riskReasons:
      result.riskReasons && result.riskReasons.length > 0
        ? result.riskReasons
        : result.humanReviewReason
          ? [result.humanReviewReason]
          : [t.risk.defaultReason],
    missingInfo: result.missingInfo,
    followUpQuestions: result.followUpQuestions,
    escalationRequired,
    workflowRoute:
      result.workflowRoute ||
      (riskLevel === 'High' ? t.risk.defaultRouteHigh : t.risk.defaultRouteNormal),
    workflowRecommendation:
      result.workflowRecommendation ||
      (escalationRequired
        ? t.risk.defaultRecommendationEscalate
        : t.risk.defaultRecommendationNormal),
    uncertaintyNotes: result.uncertaintyNotes,
    humanReviewReason: result.humanReviewReason,
  };
}

function persistConversation(messages: ConversationMessage[], result: AnswerResult) {
  sessionStorage.setItem(storageKey, JSON.stringify({ messages, result }));
}

function AnswerContent() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get('result');

  const [pageState, setPageState] = useState<PageState>(() => {
    const initialLanguage = getInitialLanguage();
    const initialState = readInitialState(resultParam, translations[initialLanguage]);

    return {
      messages: initialState.messages,
      result: initialState.result,
      language: initialLanguage,
      usingMock: Boolean(initialState.isMock),
    };
  });
  const [followUp, setFollowUp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [understood, setUnderstood] = useState(false);
  const { messages, result, language } = pageState;
  const t = translations[language];
  const riskLayer = buildRiskLayer(result, t);
  const riskStateLabel =
    riskLayer.riskLevel === 'High'
      ? t.risk.highRisk
      : riskLayer.riskLevel === 'Medium'
        ? t.risk.mediumRisk
        : t.risk.lowRisk;

  const handleLanguageChange = (nextLanguage: Language) => {
    const nextTranslations = translations[nextLanguage];

    localStorage.setItem(languageStorageKey, nextLanguage);
    setPageState((current) => {
      if (!current.usingMock) {
        return { ...current, language: nextLanguage };
      }

      const nextMockState = buildMockConversation(nextTranslations);

      return {
        messages: nextMockState.messages,
        result: nextMockState.result,
        language: nextLanguage,
        usingMock: true,
      };
    });
  };

  const handleFollowUp = async () => {
    if (!followUp.trim()) {
      setError(t.answer.followUpEmpty);
      return;
    }

    const nextMessages: ConversationMessage[] = [
      ...messages,
      { role: 'user', content: followUp.trim() },
    ];

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error('请求失败');

      const data: AnswerResult = await res.json();
      const updatedMessages: ConversationMessage[] = [
        ...nextMessages,
        { role: 'assistant', content: JSON.stringify(data) },
      ];

      setPageState((current) => ({
        ...current,
        messages: updatedMessages,
        result: data,
        usingMock: false,
      }));
      setFollowUp('');
      persistConversation(updatedMessages, data);
    } catch {
      setError(t.answer.followUpError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-6 text-gray-950 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t.answer.workflowLabel}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {t.common.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              {t.answer.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <LanguageSwitcher
              language={language}
              onChange={handleLanguageChange}
            />
            <span className="rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700">
              {t.answer.caseIntake}
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700">
              {t.answer.riskState}: {riskStateLabel}
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t.answer.conversationLabel}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-gray-950">
                  {t.answer.matterDiscussion}
                </h2>
              </div>
              <div className="space-y-3 p-5">
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    const parsed = message.role === 'assistant'
                      ? parseAssistantContent(message.content)
                      : null;
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={index}
                        className={`rounded-md border p-4 ${
                          isUser
                            ? 'border-blue-100 bg-blue-50/70'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-700">
                            {isUser
                              ? t.answer.businessQuestion
                              : t.answer.initialReview}
                          </p>
                          <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500">
                            {isUser ? t.answer.businessTeam : t.answer.reviewSystem}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-900">
                          {parsed ? parsed.answer : message.content}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    {t.answer.noConversation}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t.answer.userInput}
              </p>
              <h3 className="mt-1 text-base font-semibold text-gray-950">
                {t.answer.followUpTitle}
              </h3>
              <textarea
                className="mt-3 h-28 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder={t.answer.followUpPlaceholder}
                disabled={loading}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <button
                onClick={handleFollowUp}
                disabled={loading}
                className="mt-3 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? t.answer.updateLoading : t.answer.updateButton}
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-950">
                {t.answer.legalBasis}
              </h3>
              {result.legalBasis && result.legalBasis.length > 0 ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
                  {result.legalBasis.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  {t.answer.noLegalBasis}
                </p>
              )}
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700">
              {t.answer.disclaimer}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <label className="flex items-center space-x-3 text-sm">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                />
                <span>{t.answer.understand}</span>
              </label>
              <Link
                href={understood ? '/confirm' : '#'}
                className={`mt-4 inline-block w-full rounded-md px-6 py-3 text-center text-sm font-semibold text-white ${
                  understood
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'pointer-events-none bg-gray-300'
                }`}
              >
                {t.common.confirm}
              </Link>
            </div>
          </section>

          <RiskPanel data={riskLayer} t={t} />
        </div>
      </div>
    </main>
  );
}

export default function AnswerPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">加载中...</div>}>
      <AnswerContent />
    </Suspense>
  );
}
