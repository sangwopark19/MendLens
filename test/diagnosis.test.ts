import { describe, expect, it } from "vitest";

import {
  assessImmediateRisk,
  diagnoseErrorCode,
  prepareDiagnosis,
} from "../src/diagnosis.js";

describe("prepareDiagnosis", () => {
  it("reports a complete appliance intake as ready", () => {
    expect(
      prepareDiagnosis({
        manufacturer: "LG",
        applianceType: "washing_machine",
        model: "T1204T",
        errorCode: "UE",
        symptoms: ["탈수가 시작되지 않음"],
      }),
    ).toEqual({ status: "ready", missingFields: [] });
  });

  it("returns the exact fields still needed for diagnosis", () => {
    expect(
      prepareDiagnosis({
        manufacturer: "LG",
        applianceType: "washing_machine",
      }),
    ).toEqual({
      status: "needs_information",
      missingFields: ["model", "errorCode"],
    });
  });

  it("treats whitespace-only values as missing", () => {
    expect(
      prepareDiagnosis({
        manufacturer: "   ",
        applianceType: "air_conditioner",
        model: " ",
        errorCode: "CH05",
      }),
    ).toEqual({
      status: "needs_information",
      missingFields: ["manufacturer", "model"],
    });
  });
});

describe("diagnoseErrorCode", () => {
  it("returns official guidance only for an exact supported case", () => {
    const result = diagnoseErrorCode({
      manufacturer: "LG",
      applianceType: "washing_machine",
      model: "T1204T",
      errorCode: "UE",
    });

    expect(result).toMatchObject({
      ok: true,
      caseId: "lg-t1204t-washer-ue",
      action: "직접 해결 가능",
      appliance: {
        manufacturer: "LG전자",
        applianceType: "washing_machine",
        model: "T1204T",
        errorCode: "UE",
      },
      source: {
        checkedAt: "2026-07-14",
        url: expect.stringContaining("lge.co.kr"),
      },
    });
    if (result.ok) {
      expect(result.steps.length).toBeGreaterThanOrEqual(2);
      expect(result.reason).toContain("불균형");
    }
  });

  it("normalizes manufacturer, model, and error-code casing", () => {
    expect(
      diagnoseErrorCode({
        manufacturer: "lg전자",
        applianceType: "air_conditioner",
        model: "fq19v9kwan",
        errorCode: "ch05",
      }),
    ).toMatchObject({
      ok: true,
      caseId: "lg-fq19v9kwan-air-conditioner-ch05",
      action: "공식 AS 필요",
    });
  });

  it("does not infer guidance for an unsupported model or code", () => {
    expect(
      diagnoseErrorCode({
        manufacturer: "LG",
        applianceType: "washing_machine",
        model: "UNKNOWN",
        errorCode: "UE",
      }),
    ).toEqual({
      ok: false,
      code: "UNSUPPORTED_CASE",
      message:
        "공식 근거가 확인된 지원 사례가 아닙니다. 제품 라벨의 제조사와 모델명, 오류 코드를 다시 확인해 주세요.",
      requested: {
        manufacturer: "LG",
        applianceType: "washing_machine",
        model: "UNKNOWN",
        errorCode: "UE",
      },
    });
  });
});

describe("assessImmediateRisk", () => {
  it("stops use when a persistent burning smell is reported", () => {
    expect(
      assessImmediateRisk({
        manufacturer: "LG",
        applianceType: "air_conditioner",
        model: "FQ17S9DWAN",
        signals: ["persistent_burning_smell"],
      }),
    ).toMatchObject({
      action: "즉시 사용 중단",
      matchedSignals: ["persistent_burning_smell"],
      source: {
        checkedAt: "2026-07-14",
        url: expect.stringContaining("lge.co.kr"),
      },
    });
  });

  it("does not claim safety when no immediate signal was observed", () => {
    expect(
      assessImmediateRisk({
        manufacturer: "LG",
        applianceType: "washing_machine",
        model: "T1204T",
        signals: ["none_observed"],
      }),
    ).toEqual({
      action: "공식 AS 필요",
      matchedSignals: [],
      message:
        "즉시 중단 신호는 입력되지 않았지만 안전을 보장할 수는 없습니다. 오류 코드 진단을 계속하거나 공식 AS에 문의해 주세요.",
      source: null,
    });
  });
});
