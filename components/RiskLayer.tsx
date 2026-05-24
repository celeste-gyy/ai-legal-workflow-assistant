export type RiskLevel = 'Low' | 'Medium' | 'High';

export type RiskLayerData = {
  riskLevel: RiskLevel;
  previousRiskLevel?: RiskLevel | null;
  riskEscalated?: boolean;
  riskReasons: string[];
  missingInfo?: string[];
  followUpQuestions?: string[];
  escalationRequired: boolean;
  workflowRoute: string;
  workflowRecommendation: string;
  uncertaintyNotes?: string[];
  humanReviewReason?: string;
};

type RiskLayerProps = {
  data: RiskLayerData;
};

const riskStyles: Record<
  RiskLevel,
  {
    label: string;
    badge: string;
    panel: string;
    border: string;
  }
> = {
  Low: {
    label: 'Low Risk',
    badge: 'bg-green-100 text-green-700 border-green-200',
    panel: 'bg-green-50',
    border: 'border-green-200',
  },
  Medium: {
    label: 'Medium Risk',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    panel: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  High: {
    label: 'High Risk',
    badge: 'bg-red-100 text-red-700 border-red-200',
    panel: 'bg-red-50',
    border: 'border-red-300',
  },
};

export default function RiskLayer({ data }: RiskLayerProps) {
  const styles = riskStyles[data.riskLevel];
  const previousStyles = data.previousRiskLevel
    ? riskStyles[data.previousRiskLevel]
    : null;
  const showHumanReview =
    data.riskLevel === 'High' || data.escalationRequired || Boolean(data.humanReviewReason);

  return (
    <section
      className={`w-full max-w-3xl rounded-lg border ${styles.border} ${styles.panel} p-5`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Risk Layer
          </p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            Workflow Risk Assessment
          </h2>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-md border px-3 py-1 text-sm font-semibold ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      {data.previousRiskLevel && (
        <div className="mt-4 rounded-md border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-500">Risk Movement</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${previousStyles?.badge}`}
            >
              {data.previousRiskLevel}
            </span>
            <span className="text-gray-400">→</span>
            <span
              className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${styles.badge}`}
            >
              {data.riskLevel}
            </span>
            <span
              className={`ml-0 rounded-md px-2.5 py-1 text-sm font-semibold sm:ml-2 ${
                data.riskEscalated
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {data.riskEscalated ? 'Risk Escalated' : 'No Escalation'}
            </span>
          </div>
        </div>
      )}

      {showHumanReview && (
        <div className="mt-4 rounded-md border border-red-200 bg-white p-4">
          <p className="font-semibold text-red-700">Human Review Recommended</p>
          <p className="mt-1 text-sm text-gray-700">
            {data.humanReviewReason ||
              'This matter may require legal judgment before the business team proceeds.'}
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-500">Workflow Route</p>
          <p className="mt-2 font-medium text-gray-900">{data.workflowRoute}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-500">Escalation</p>
          <p className="mt-2 font-medium text-gray-900">
            {data.escalationRequired ? 'Required' : 'Not required at this stage'}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-gray-200 bg-white p-4">
        <h3 className="font-semibold text-gray-900">Risk Reasons</h3>
        {data.riskReasons.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            {data.riskReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500">No specific risk reason was identified.</p>
        )}
      </div>

      {data.missingInfo && data.missingInfo.length > 0 && (
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-semibold text-gray-900">Missing Information</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            {data.missingInfo.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4">
        <h3 className="font-semibold text-gray-900">Workflow Recommendation</h3>
        <p className="mt-2 text-gray-700">{data.workflowRecommendation}</p>
      </div>

      {data.uncertaintyNotes && data.uncertaintyNotes.length > 0 && (
        <div className="mt-5 rounded-md border border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-900">Uncertainty Notes</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            {data.uncertaintyNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
