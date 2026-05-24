export type Language = 'zh' | 'en';

export const defaultLanguage: Language = 'zh';
export const languageStorageKey = 'legal-ai-language';

export function isLanguage(value: string | null): value is Language {
  return value === 'zh' || value === 'en';
}

export type Translation = {
  language: Record<Language, string>;
  common: {
    title: string;
    productTitle: string;
    subtitle: string;
    start: string;
    backHome: string;
    confirm: string;
    yes: string;
    no: string;
  };
  home: {
    workflowLabel: string;
    heroSubtitle: string;
    cta: string;
    previewTitle: string;
    previewSteps: string[];
    features: {
      title: string;
      description: string;
    }[];
    description: string;
  };
  question: {
    workflowLabel: string;
    title: string;
    placeholder: string;
    emptyError: string;
    requestError: string;
    loading: string;
    submit: string;
  };
  answer: {
    workflowLabel: string;
    subtitle: string;
    caseIntake: string;
    riskState: string;
    conversationLabel: string;
    matterDiscussion: string;
    businessQuestion: string;
    initialReview: string;
    userInput: string;
    businessTeam: string;
    reviewSystem: string;
    reviewSummary: string;
    noConversation: string;
    followUpTitle: string;
    followUpPlaceholder: string;
    followUpEmpty: string;
    followUpError: string;
    updateLoading: string;
    updateButton: string;
    legalBasis: string;
    noLegalBasis: string;
    disclaimer: string;
    understand: string;
  };
  risk: {
    panelTitle: string;
    currentRiskState: string;
    lowRisk: string;
    mediumRisk: string;
    highRisk: string;
    escalationBanner: string;
    humanReviewRecommended: string;
    humanReviewRecommendation: string;
    humanReviewFallback: string;
    noHumanReview: string;
    legalReviewRequired: string;
    escalationBannerTitle: string;
    workflowRoute: string;
    escalationRequired: string;
    riskReasons: string;
    noRiskReasons: string;
    missingInfo: string;
    followUpQuestions: string;
    noFollowUpQuestions: string;
    riskMovement: string;
    riskEscalated: string;
    noEscalation: string;
    to: string;
    escalated: string;
    stable: string;
    submitReview: string;
    defaultReason: string;
    defaultRouteHigh: string;
    defaultRouteNormal: string;
    defaultRecommendationEscalate: string;
    defaultRecommendationNormal: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    humanReviewRecommended: string;
    steps: string[];
  };
  confirm: {
    title: string;
    description: string;
  };
  mock: {
    user: string;
    initialAssistant: string;
    followUpUser: string;
    assistant: string;
    riskReasons: string[];
    missingInfo: string[];
    workflowRoute: string;
    humanReviewReason: string;
    legalBasis: string[];
  };
};

export const translations: Record<Language, Translation> = {
  zh: {
    language: {
      zh: '中文',
      en: 'English',
    },
    common: {
      title: 'AI 法务工作流助手',
      productTitle: 'AI Legal Workflow Assistant',
      subtitle: '企业合同与合规风险初步识别、分流与法务升级',
      start: '开始风险评估',
      backHome: '返回首页',
      confirm: '确认',
      yes: '是',
      no: '否',
    },
    home: {
      workflowLabel: '合同与合规工作流',
      heroSubtitle: '帮助业务团队识别合同与合规风险，并在高风险场景下升级至法务复核。',
      cta: '开始风险评估',
      previewTitle: '工作流预览',
      previewSteps: ['业务问题提交', '初步审查', '风险分流', '法务复核'],
      features: [
        {
          title: '风险识别',
          description: '识别合同条款、数据合规与跨境业务风险。',
        },
        {
          title: '工作流分流',
          description: '根据风险等级进入合同审查、数据合规或国际法务流程。',
        },
        {
          title: '人工复核',
          description: '高风险场景自动建议法务介入。',
        },
      ],
      description: '面向 NDA、数据跨境、海外客户合同、自动续约与付款责任条款的内部法务工作流工具',
    },
    question: {
      workflowLabel: '合同与合规受理',
      title: '提交合同或合规问题',
      placeholder: '例如：客户要求将用户数据部署在海外服务器',
      emptyError: '请输入合同或合规问题',
      requestError: '获取回答失败，请重试',
      loading: '正在进行初步审查...',
      submit: '提交问题',
    },
    answer: {
      workflowLabel: '合同与合规工作流',
      subtitle: '多轮合同风险识别、合规分流与法务升级建议',
      caseIntake: '事项受理',
      riskState: '风险状态',
      conversationLabel: '会话记录',
      matterDiscussion: '事项讨论',
      businessQuestion: '业务问题',
      initialReview: '初步审查',
      userInput: '用户输入',
      businessTeam: '业务团队',
      reviewSystem: '审查系统',
      reviewSummary: '审查摘要',
      noConversation: '暂无会话记录，已展示默认合同合规场景。',
      followUpTitle: '继续补充合同或合规信息',
      followUpPlaceholder: '例如：该客户位于欧盟，合同包含自动续约条款，并要求处理用户行为数据。',
      followUpEmpty: '请输入补充信息或追问',
      followUpError: '更新风险状态失败，请重试',
      updateLoading: '正在更新风险状态...',
      updateButton: '更新风险状态',
      legalBasis: '相关依据',
      noLegalBasis: '暂无具体法条或监管依据',
      disclaimer: '本结果用于业务团队初步识别合同与合规风险并流转工作流，不构成正式法律意见，也不替代法务或律师的最终判断。',
      understand: '我理解系统输出不构成正式法律意见',
    },
    risk: {
      panelTitle: '风险与工作流面板',
      currentRiskState: '当前风险状态',
      lowRisk: '低风险',
      mediumRisk: '中风险',
      highRisk: '高风险',
      escalationBanner: '升级提示：在业务继续推进前，建议完成法务与数据合规人工复核。',
      humanReviewRecommended: '建议人工法务复核',
      humanReviewRecommendation: '人工复核建议',
      humanReviewFallback: '该事项建议流转至法务团队进行人工复核。',
      noHumanReview: '当前风险状态未要求立即升级至人工法务复核。',
      legalReviewRequired: '需要法务复核',
      escalationBannerTitle: '风险已升级',
      workflowRoute: '工作流路径',
      escalationRequired: '是否需要升级',
      riskReasons: '风险原因',
      noRiskReasons: '未识别到明确风险原因。',
      missingInfo: '缺失信息',
      followUpQuestions: '待补充问题',
      noFollowUpQuestions: '当前没有待补充问题。',
      riskMovement: '风险变化',
      riskEscalated: '风险已升级',
      noEscalation: '风险未升级',
      to: '→',
      escalated: '已升级',
      stable: '未升级',
      submitReview: '提交法务复核',
      defaultReason: '当前合同或合规事项仍缺少关键事实，建议补充数据处理、合同条款与交易地域信息。',
      defaultRouteHigh: '数据合规审查',
      defaultRouteNormal: '合同审查',
      defaultRecommendationEscalate: '建议提交法务与数据合规复核，并在获得人工确认前暂缓签署或部署。',
      defaultRecommendationNormal: '建议进入合同审查流程，并记录初步审查摘要供法务后续参考。',
    },
    timeline: {
      title: '工作流时间线',
      subtitle: '流转进度',
      humanReviewRecommended: '建议人工法务复核',
      steps: [
        '业务问题提交',
        '初步审查',
        '风险分析',
        '工作流分流',
        '人工复核建议',
      ],
    },
    confirm: {
      title: '已完成确认',
      description: '你已确认了解系统输出的局限性。如涉及合同签署、数据处理、跨境传输或监管风险，请务必咨询公司法务或专业律师。',
    },
    mock: {
      user: '客户要求将用户数据部署在海外服务器。',
      initialAssistant: '初步判断为中风险。该事项可能涉及数据跨境或境外处理，需要先确认客户地区、用户数据类型、服务器所在地和合同责任范围。',
      followUpUser: '补充：该服务涉及欧洲用户数据，并且合同包含自动续约和较宽泛的数据处理授权。',
      assistant: '风险已升级为高风险。该事项涉及欧洲用户数据、境外部署、自动续约以及较宽泛的数据处理授权，建议进入数据合规审查，并在签署或部署前完成法务复核。',
      riskReasons: [
        '可能涉及用户数据跨境传输或境外处理，需要确认数据类型、数据主体所在地和服务器区域。',
        '自动续约条款可能影响付款义务、终止权和通知期限。',
        '较宽泛的数据处理授权可能需要与隐私政策、DPA 或客户合同保持一致。',
      ],
      missingInfo: [
        '服务器所在国家或地区',
        '是否包含欧盟用户数据或 GDPR 适用场景',
        '自动续约的通知期限、付款责任和终止机制',
      ],
      workflowRoute: '数据合规审查',
      humanReviewReason: '涉及用户数据处理、海外部署与合同责任条款，建议人工法务和数据合规复核。',
      legalBasis: ['个人信息保护、数据出境与合同责任相关合规要求', '客户合同、DPA、隐私政策与服务条款的一致性审查'],
    },
  },
  en: {
    language: {
      zh: '中文',
      en: 'English',
    },
    common: {
      title: 'AI Legal Workflow Assistant',
      productTitle: 'AI Legal Workflow Assistant',
      subtitle: 'Enterprise contract and compliance workflow triage, routing, and escalation',
      start: 'Start Contract Review',
      backHome: 'Back Home',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
    },
    home: {
      workflowLabel: 'Contract & Compliance Workflow',
      heroSubtitle: 'Help business teams identify contract and compliance risks, with human review for high-risk scenarios.',
      cta: 'Start Risk Review',
      previewTitle: 'Workflow Preview',
      previewSteps: [
        'Business Question',
        'Initial Review',
        'Risk Routing',
        'Legal Review',
      ],
      features: [
        {
          title: 'Risk Detection',
          description: 'Identify contract, data compliance, and cross-border risks.',
        },
        {
          title: 'Workflow Routing',
          description: 'Route issues into contract review, data compliance, or international legal workflows.',
        },
        {
          title: 'Human Review',
          description: 'Recommend legal review for high-risk scenarios.',
        },
      ],
      description: 'An internal legal workflow tool for NDA review, cross-border data, overseas customer contracts, auto-renewal terms, and payment liability clauses.',
    },
    question: {
      workflowLabel: 'Contract & Compliance Intake',
      title: 'Submit a Contract or Compliance Question',
      placeholder: 'For example: The client requests deploying user data on overseas servers.',
      emptyError: 'Please enter a contract or compliance question.',
      requestError: 'Failed to get a review response. Please try again.',
      loading: 'Running initial review...',
      submit: 'Submit Question',
    },
    answer: {
      workflowLabel: 'Contract & Compliance Workflow',
      subtitle: 'Multi-turn contract risk triage, compliance routing, and legal escalation',
      caseIntake: 'Case Intake',
      riskState: 'Risk State',
      conversationLabel: 'Conversation',
      matterDiscussion: 'Matter Discussion',
      businessQuestion: 'Business Question',
      initialReview: 'Initial Review',
      userInput: 'User Input',
      businessTeam: 'Business Team',
      reviewSystem: 'Review System',
      reviewSummary: 'Review Summary',
      noConversation: 'No conversation yet. Showing the default contract compliance scenario.',
      followUpTitle: 'Add Contract or Compliance Details',
      followUpPlaceholder: 'For example: The customer is in the EU, the contract includes auto-renewal, and user behavior data will be processed.',
      followUpEmpty: 'Please enter additional information or a follow-up question.',
      followUpError: 'Failed to update the risk state. Please try again.',
      updateLoading: 'Updating risk state...',
      updateButton: 'Update Risk State',
      legalBasis: 'Relevant Basis',
      noLegalBasis: 'No specific legal or regulatory basis yet.',
      disclaimer: 'This output is for initial contract and compliance risk triage and workflow routing only. It is not formal legal advice and does not replace legal counsel.',
      understand: 'I understand the review output is not formal legal advice.',
    },
    risk: {
      panelTitle: 'Risk & Workflow Panel',
      currentRiskState: 'Current Risk State',
      lowRisk: 'LOW RISK',
      mediumRisk: 'MEDIUM RISK',
      highRisk: 'HIGH RISK',
      escalationBanner: 'Escalation banner: legal and data compliance review should be completed before the business proceeds.',
      humanReviewRecommended: 'Human Review Recommended',
      humanReviewRecommendation: 'Human Review Recommendation',
      humanReviewFallback: 'This matter should be routed to legal for human review.',
      noHumanReview: 'The current risk state does not require immediate legal escalation.',
      legalReviewRequired: 'Legal Review Required',
      escalationBannerTitle: 'Risk Escalated',
      workflowRoute: 'Workflow Route',
      escalationRequired: 'Escalation Required',
      riskReasons: 'Risk Reasons',
      noRiskReasons: 'No specific risk reason was identified.',
      missingInfo: 'Missing Information',
      followUpQuestions: 'Follow-up Questions',
      noFollowUpQuestions: 'No follow-up questions at this stage.',
      riskMovement: 'Risk Movement',
      riskEscalated: 'Risk escalated',
      noEscalation: 'No escalation',
      to: 'to',
      escalated: 'Escalated',
      stable: 'Stable',
      submitReview: 'Submit Legal Review',
      defaultReason: 'This contract or compliance matter is missing key facts about data processing, contractual terms, and transaction geography.',
      defaultRouteHigh: 'Data Compliance Review',
      defaultRouteNormal: 'Contract Review',
      defaultRecommendationEscalate: 'Submit legal and data compliance review, and pause signing or deployment until human confirmation.',
      defaultRecommendationNormal: 'Route to contract review and keep the initial review notes for legal follow-up.',
    },
    timeline: {
      title: 'Workflow Timeline',
      subtitle: 'Routing Progress',
      humanReviewRecommended: 'Human Review Recommended',
      steps: [
        'Business Question Submitted',
        'Initial Review',
        'Risk Analysis',
        'Workflow Routing',
        'Human Review Recommendation',
      ],
    },
    confirm: {
      title: 'Confirmation Complete',
      description: 'You have confirmed that you understand the limits of the review output. For contract signing, data processing, cross-border transfer, or regulatory risk, consult your legal team or qualified counsel.',
    },
    mock: {
      user: 'The client requests deploying user data on overseas servers.',
      initialAssistant: 'Initial review indicates medium risk. This may involve cross-border data transfer or overseas processing, and requires confirmation of customer region, data categories, server location, and contract liability scope.',
      followUpUser: 'Additional context: the service involves European user data, and the contract includes auto-renewal plus broad data processing authorization.',
      assistant: 'Risk has escalated to high. This matter involves European user data, overseas deployment, auto-renewal terms, and broad data processing authorization. Route to data compliance review and complete legal review before signing or deployment.',
      riskReasons: [
        'User data may be transferred or processed overseas, so the data type, data subject location, and hosting region need review.',
        'Auto-renewal terms may affect payment obligations, termination rights, and notice periods.',
        'Broad data processing authorization should be aligned with the privacy policy, DPA, and customer contract.',
      ],
      missingInfo: [
        'Server country or region',
        'Whether EU user data or GDPR applies',
        'Auto-renewal notice period, payment liability, and termination mechanism',
      ],
      workflowRoute: 'Data Compliance Review',
      humanReviewReason: 'The matter involves user data processing, overseas deployment, and contract liability terms. Legal and data compliance review is recommended.',
      legalBasis: ['Privacy, data export, and contractual liability compliance requirements', 'Consistency review across the customer contract, DPA, privacy policy, and service terms'],
    },
  },
};
