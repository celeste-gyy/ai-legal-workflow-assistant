import type { Translation } from '@/lib/i18n';

type WorkflowTimelineProps = {
  riskLevel: 'Low' | 'Medium' | 'High';
  escalationRequired: boolean;
  t: Translation;
};

export default function WorkflowTimeline({
  riskLevel,
  escalationRequired,
  t,
}: WorkflowTimelineProps) {
  const steps = t.timeline.steps;
  const activeStepCount = escalationRequired || riskLevel === 'High' ? steps.length : 4;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t.timeline.title}
          </p>
          <h3 className="mt-1 text-base font-semibold text-gray-950">
            {t.timeline.subtitle}
          </h3>
        </div>
        <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
          {activeStepCount}/{steps.length}
        </span>
      </div>

      <ol className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index < activeStepCount;
          const isHumanReview = index === steps.length - 1;
          const isHighRiskReview = isHumanReview && (riskLevel === 'High' || escalationRequired);

          return (
            <li key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                    isHighRiskReview
                      ? 'border-red-300 bg-red-100 text-red-700'
                      : isActive
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className={`mt-2 h-7 w-px ${
                      index + 1 < activeStepCount ? 'bg-blue-200' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? 'text-gray-950' : 'text-gray-400'
                  }`}
                >
                  {step}
                </p>
                {isHighRiskReview && (
                  <p className="mt-1 text-xs font-medium text-red-700">
                    {t.timeline.humanReviewRecommended}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
