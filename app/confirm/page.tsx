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

export default function ConfirmPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const t = translations[language];

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem(languageStorageKey, nextLanguage);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-6 text-gray-950 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-4xl flex-col">
        <div className="flex justify-end">
          <LanguageSwitcher
            language={language}
            onChange={handleLanguageChange}
          />
        </div>
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-3xl font-bold">{t.confirm.title}</h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-600">
            {t.confirm.description}
          </p>
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            {t.common.backHome}
          </Link>
        </section>
      </div>
    </main>
  );
}
