export type FinalAction =
  | "즉시 사용 중단"
  | "직접 해결 가능"
  | "공식 AS 필요";

export type ApplianceType =
  | "washing_machine"
  | "air_conditioner"
  | "refrigerator"
  | "dishwasher"
  | "robot_vacuum";

export interface DiagnosisIntake {
  manufacturer?: string;
  applianceType?: ApplianceType;
  model?: string;
  errorCode?: string;
  symptoms?: string[];
}

type MissingField = "manufacturer" | "applianceType" | "model" | "errorCode";

export interface DiagnosisRequest {
  manufacturer: string;
  applianceType: ApplianceType;
  model: string;
  errorCode: string;
}

interface EvidenceSource {
  title: string;
  url: string;
  checkedAt: "2026-07-14";
}

interface SupportedCase {
  caseId: string;
  manufacturerKey: "lg";
  manufacturer: "LG전자";
  applianceType: ApplianceType;
  model: string;
  errorCode: string;
  action: FinalAction;
  reason: string;
  steps: string[];
  safetyNotes: string[];
  source: EvidenceSource;
}

export type DiagnosisResult =
  | ({
      ok: true;
      appliance: {
        manufacturer: string;
        applianceType: ApplianceType;
        model: string;
        errorCode: string;
      };
    } & Pick<
      SupportedCase,
      | "caseId"
      | "action"
      | "reason"
      | "steps"
      | "safetyNotes"
      | "source"
    >)
  | {
      ok: false;
      code: "UNSUPPORTED_CASE";
      message: string;
      requested: DiagnosisRequest;
    };

export type SafetySignal =
  | "smoke"
  | "flame"
  | "sparks"
  | "charred_power_connection"
  | "persistent_burning_smell"
  | "water_on_electrical_parts"
  | "none_observed";

export interface SafetyRiskRequest {
  manufacturer: string;
  applianceType: ApplianceType;
  model: string;
  signals: SafetySignal[];
}

const CHECKED_AT = "2026-07-14" as const;

const SUPPORTED_CASES: readonly SupportedCase[] = [
  {
    caseId: "lg-t1204t-washer-ue",
    manufacturerKey: "lg",
    manufacturer: "LG전자",
    applianceType: "washing_machine",
    model: "T1204T",
    errorCode: "UE",
    action: "직접 해결 가능",
    reason:
      "UE는 세탁물이 한쪽으로 치우치거나 세탁기의 수평이 맞지 않을 때 발생하는 불균형 오류입니다.",
    steps: [
      "동작을 멈추고 뭉친 세탁물을 고르게 펴서 다시 배치하세요.",
      "이불이나 대형 세탁물은 한 장씩 전용 코스로 세탁하세요.",
      "세탁기가 흔들리면 수평 조절 다리를 바닥에 밀착시키세요.",
    ],
    safetyNotes: [
      "전기담요, 카펫, 커튼, 고무 매트 등 제조사가 금지한 품목은 세탁하지 마세요.",
      "조치 후에도 오류나 과도한 진동이 반복되면 사용을 멈추고 공식 AS를 요청하세요.",
    ],
    source: {
      title: "LG 통돌이 세탁기 UE(불균형) 오류 안내",
      url: "https://www.lge.co.kr/support/solutions-1779808?cstFlag=Y&mktModelCd=T1204T&svcqr=",
      checkedAt: CHECKED_AT,
    },
  },
  {
    caseId: "lg-f8q6cnvkq-washer-ue",
    manufacturerKey: "lg",
    manufacturer: "LG전자",
    applianceType: "washing_machine",
    model: "F8Q6CNVKQ",
    errorCode: "UE",
    action: "직접 해결 가능",
    reason:
      "UE는 탈수 중 세탁물이 한쪽으로 쏠려 무게 중심이 맞지 않을 때 발생할 수 있습니다.",
    steps: [
      "세탁물을 세탁통 용량의 약 3분의 2 이하로 조절하고 뭉친 옷감을 풀어주세요.",
      "세탁망은 단독으로 넣지 말고 다른 의류와 균형 있게 배치하세요.",
      "제품이 흔들리면 수평 조절 다리를 바닥에 밀착시키세요.",
    ],
    safetyNotes: [
      "방수 소재, 전기담요, 카펫, 고무 매트 등 제조사가 금지한 품목은 세탁하지 마세요.",
      "오류가 반복되거나 비정상적인 충격음이 계속되면 공식 AS 점검을 받으세요.",
    ],
    source: {
      title: "LG 드럼세탁기 UE(불균형) 오류 안내",
      url: "https://www.lge.co.kr/support/solutions-1779965?cstFlag=Y&mktModelCd=F8Q6CNVKQ&svcqr=",
      checkedAt: CHECKED_AT,
    },
  },
  {
    caseId: "lg-fq19v9kwan-air-conditioner-ch05",
    manufacturerKey: "lg",
    manufacturer: "LG전자",
    applianceType: "air_conditioner",
    model: "FQ19V9KWAN",
    errorCode: "CH05",
    action: "공식 AS 필요",
    reason: "CH05는 실내기와 실외기 사이의 통신 이상을 알리는 점검 코드입니다.",
    steps: [
      "신규 또는 이전 설치 직후라면 설치 엔지니어에게 점검을 요청하세요.",
      "사용 중 발생했다면 전원 코드 또는 전용 차단기를 내리고 약 5분 후 다시 켜세요.",
      "전원 초기화 후에도 코드가 반복되면 공식 서비스매니저의 점검을 받으세요.",
    ],
    safetyNotes: [
      "반복해서 차단기를 조작하지 말고 같은 오류가 지속되면 사용을 중단하세요.",
    ],
    source: {
      title: "LG 스탠드형 에어컨 CH05 오류 안내",
      url: "https://www.lge.co.kr/support/solutions-20150310809781?category=CT50019183&cstFlag=Y&mktModelCd=FQ19V9KWAN&page=0&seq=60&sort=update&subCategory=CT50019199",
      checkedAt: CHECKED_AT,
    },
  },
];

const DANGEROUS_SIGNALS = new Set<SafetySignal>([
  "smoke",
  "flame",
  "sparks",
  "charred_power_connection",
  "persistent_burning_smell",
  "water_on_electrical_parts",
]);

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeManufacturer(value: string): string {
  const normalized = value.trim().toLocaleLowerCase().replaceAll(" ", "");
  if (["lg", "lg전자", "lge", "lgelectronics"].includes(normalized)) {
    return "lg";
  }
  return normalized;
}

export function prepareDiagnosis(input: DiagnosisIntake): {
  status: "ready" | "needs_information";
  missingFields: MissingField[];
} {
  const missingFields: MissingField[] = [];

  if (!hasText(input.manufacturer)) missingFields.push("manufacturer");
  if (!input.applianceType) missingFields.push("applianceType");
  if (!hasText(input.model)) missingFields.push("model");
  if (!hasText(input.errorCode)) missingFields.push("errorCode");

  return {
    status: missingFields.length === 0 ? "ready" : "needs_information",
    missingFields,
  };
}

export function diagnoseErrorCode(input: DiagnosisRequest): DiagnosisResult {
  const normalizedRequest: DiagnosisRequest = {
    manufacturer: input.manufacturer.trim(),
    applianceType: input.applianceType,
    model: input.model.trim().toLocaleUpperCase(),
    errorCode: input.errorCode.trim().toLocaleUpperCase(),
  };
  const manufacturerKey = normalizeManufacturer(input.manufacturer);
  const match = SUPPORTED_CASES.find(
    (candidate) =>
      candidate.manufacturerKey === manufacturerKey &&
      candidate.applianceType === normalizedRequest.applianceType &&
      candidate.model === normalizedRequest.model &&
      candidate.errorCode === normalizedRequest.errorCode,
  );

  if (!match) {
    return {
      ok: false,
      code: "UNSUPPORTED_CASE",
      message:
        "공식 근거가 확인된 지원 사례가 아닙니다. 제품 라벨의 제조사와 모델명, 오류 코드를 다시 확인해 주세요.",
      requested: normalizedRequest,
    };
  }

  return {
    ok: true,
    caseId: match.caseId,
    appliance: {
      manufacturer: match.manufacturer,
      applianceType: match.applianceType,
      model: match.model,
      errorCode: match.errorCode,
    },
    action: match.action,
    reason: match.reason,
    steps: [...match.steps],
    safetyNotes: [...match.safetyNotes],
    source: { ...match.source },
  };
}

export function assessImmediateRisk(input: SafetyRiskRequest): {
  action: FinalAction;
  matchedSignals: SafetySignal[];
  message: string;
  source: EvidenceSource | null;
} {
  const matchedSignals = input.signals.filter((signal) =>
    DANGEROUS_SIGNALS.has(signal),
  );

  if (matchedSignals.length === 0) {
    return {
      action: "공식 AS 필요",
      matchedSignals: [],
      message:
        "즉시 중단 신호는 입력되지 않았지만 안전을 보장할 수는 없습니다. 오류 코드 진단을 계속하거나 공식 AS에 문의해 주세요.",
      source: null,
    };
  }

  const isVerifiedBurningSmellCase =
    normalizeManufacturer(input.manufacturer) === "lg" &&
    input.applianceType === "air_conditioner" &&
    input.model.trim().toLocaleUpperCase() === "FQ17S9DWAN" &&
    matchedSignals.includes("persistent_burning_smell");

  return {
    action: "즉시 사용 중단",
    matchedSignals,
    message:
      "제품 사용을 즉시 중단하세요. 젖은 손이나 침수된 부분을 만지지 말고, 안전하게 할 수 있을 때만 전원을 차단한 뒤 공식 AS에 점검을 요청하세요.",
    source: isVerifiedBurningSmellCase
      ? {
          title: "LG 스탠드형 에어컨의 지속적인 타는 냄새 조치 안내",
          url: "https://www.lge.co.kr/support/solutions-20150145438200?category=CT50019183&cstFlag=Y&mktModelCd=FQ17S9DWAN&page=0&seq=67&sort=update&subCategory=CT50019199",
          checkedAt: CHECKED_AT,
        }
      : {
          title: "LG전자 안전사고 Zero 캠페인",
          url: "https://www.lge.co.kr/support/solutions-20154492618269",
          checkedAt: CHECKED_AT,
        },
  };
}
