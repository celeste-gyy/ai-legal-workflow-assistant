'use client';

import Link from 'next/link';
import { useState } from 'react';
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

export default function Home() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const t = translations[language];

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem(languageStorageKey, nextLanguage);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-6 text-gray-950 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link href="/" className="text-sm font-semibold text-gray-950">
            {t.common.title}
          </Link>
          <LanguageSwitcher
            language={language}
            onChange={handleLanguageChange}
          />
        </header>

        <section className="mx-auto flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="mb-4 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 shadow-sm">
            {t.home.workflowLabel}
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {t.common.title}
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-8 text-gray-600">
            {t.home.heroSubtitle}
          </p>
          <Link
            href="/question"
            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            {t.home.cta}
          </Link>
        </section>

        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-950">
            {t.home.previewTitle}
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            {t.home.previewSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {t.home.features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-gray-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
