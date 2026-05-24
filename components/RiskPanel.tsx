import WorkflowTimeline from '@/components/WorkflowTimeline';
import type { RiskLayerData, RiskLevel } from '@/components/RiskLayer';
import type { Translation } from '@/lib/i18n';

type RiskPanelProps = {
  data: RiskLayerData;
  t: Translation;
};

const riskStyles: Record<
  RiskLevel,
  {
    badge: string;
    border: string;
    banner: string;
    button: string;
  }
> = {
  Low: {
    badge: 'border-green-200 bg-green-50 text-green-700',
    border: 'border-gray-200',
    banner: 'border-green-200 bg-green-50 text-green-800',
    button: 'bg-gray-900 hover:bg-gray-800',
  },
  Medium: {
    badge: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    border: 'border-yellow-200',
    banner: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    button: 'bg-gray-900 hover:bg-gray-800',
  },
  High: {
    badge: 'border-red-300 bg-red-50 text-red-700',
    border: 'border-red-300',
    banner: 'border-red-300 bg-red-50 text-red-800',
    button: 'bg-red-700 hover:bg-red-800',
  },
};

export default function RiskPanel({ data, t }: RiskPanelProps) {
  const styles = riskStyles[data.riskLevel];
  const getRiskLabel = (level: RiskLevel) =>
    level === 'High'
      ? t.risk.highRisk
      : level === 'Medium'
        ? t.risk.mediumRisk
        : t.risk.lowRisk;
  const riskLabel = getRiskLabel(data.riskLevel);
  const humanReviewRecommended =
    data.riskLevel === 'High' || data.escalationRequired || Boolean(data.humanReviewReason);

  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      <section className={`rounded-lg border bg-white p-5 shadow-sm ${styles.border}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.risk.panelTitle}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-950">
              {t.risk.currentRiskState}
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
          >
            {riskLabel}
          </span>
        </div>

        {data.riskLevel === 'High' && (
          <div className={`mt-4 rounded-md border p-3 ${styles.banner}`}>
            <p className="text-sm font-bold">{t.risk.escalationBannerTitle}</p>
            <p className="mt-1 text-sm font-semibold">
              {t.risk.legalReviewRequired}
            </p>
            <p className="mt-1 text-sm">{t.risk.escalationBanner}</p>
          </div>
        )}

        <div
          className={`mt-4 rounded-md border p-3 ${
            humanReviewRecommended
              ? 'border-red-200 bg-red-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              humanReviewRecommended ? 'text-red-700' : 'text-gray-700'
            }`}
          >
            {t.risk.humanReviewRecommendation}
          </p>
          <p
            className={`mt-1 text-sm ${
              humanReviewRecommended ? 'text-red-800' : 'text-gray-600'
            }`}
          >
            {humanReviewRecommended
              ? data.humanReviewReason || t.risk.humanReviewFallback
              : t.risk.noHumanReview}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.risk.workflowRoute}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-950">
              {data.workflowRoute}
            </p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.risk.escalationRequired}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-950">
              {data.escalationRequired ? t.common.yes : t.common.no}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-950">{t.risk.riskReasons}</h3>
          {data.riskReasons.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {data.riskReasons.map((reason, index) => (
                <li key={index} className="flex gap-2 text-sm text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              {t.risk.noRiskReasons}
            </p>
          )}
        </div>

        {data.missingInfo && data.missingInfo.length > 0 && (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-gray-950">{t.risk.missingInfo}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {data.missingInfo.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.previousRiskLevel && (
          <div
            className={`mt-5 rounded-md border p-3 ${
              data.riskEscalated
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.risk.riskMovement}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-950">
              {getRiskLabel(data.previousRiskLevel)} {t.risk.to} {riskLabel}
              <span
                className={`ml-2 rounded px-2 py-0.5 text-xs ${
                  data.riskEscalated
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {data.riskEscalated ? t.risk.riskEscalated : t.risk.noEscalation}
              </span>
            </p>
          </div>
        )}

        <div className="mt-5 rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-gray-950">
            {t.risk.followUpQuestions}
          </h3>
          {data.followUpQuestions && data.followUpQuestions.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {data.followUpQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              {t.risk.noFollowUpQuestions}
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4">
          <button
            type="button"
            className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm ${styles.button}`}
          >
            {t.risk.submitReview}
          </button>
        </div>
      </section>

      <WorkflowTimeline
        riskLevel={data.riskLevel}
        escalationRequired={data.escalationRequired}
        t={t}
      />
    </aside>
  );
}
