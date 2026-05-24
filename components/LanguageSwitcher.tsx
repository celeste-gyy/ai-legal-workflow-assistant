import type { Language } from '@/lib/i18n';
import { translations } from '@/lib/i18n';

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
};

export default function LanguageSwitcher({
  language,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 bg-white p-1 text-sm shadow-sm">
      {(['zh', 'en'] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded px-3 py-1.5 font-medium ${
            language === item
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {translations[language].language[item]}
        </button>
      ))}
    </div>
  );
}
