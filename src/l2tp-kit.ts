import { createDefaultL2TPCoreDraft, rawL2TPCoreConfigFromDraft, validateL2TPCoreConfig } from "@pasarguard/l2tp-config-kit";
import { parseConfigInput } from "./json.js";
import type {
  CoreConfigTemplateResult,
  CoreKit,
  CoreKitValidationIssue,
  CoreKitValidationResult
} from "./types.js";
import type { L2TPCoreConfig } from "@pasarguard/l2tp-config-kit";

function mapL2TPIssue(issue: {
  readonly code: string;
  readonly path: string;
  readonly message: string;
}): CoreKitValidationIssue {
  return {
    code: issue.code,
    path: issue.path,
    message: issue.message,
    severity: "error"
  };
}

function createDefaultConfigJson(): CoreConfigTemplateResult {
  const draft = createDefaultL2TPCoreDraft();
  return {
    kind: "l2tp",
    configJson: JSON.stringify(rawL2TPCoreConfigFromDraft(draft), null, 2),
    generated: {
      l2tpPsk: draft.psk
    }
  };
}

function validateConfig(input: unknown): CoreKitValidationResult<L2TPCoreConfig> {
  const parsed = parseConfigInput(input);
  if (!parsed.ok) return parsed;

  const result = validateL2TPCoreConfig(parsed.config);
  if (result.ok) {
    return {
      ok: true,
      config: result.config,
      issues: []
    };
  }

  return {
    ok: false,
    issues: result.issues.map(mapL2TPIssue)
  };
}

export const l2tpKit: CoreKit<L2TPCoreConfig> = {
  kind: "l2tp",
  label: "L2TP/IPsec",
  browserSafe: true,
  capabilities: {
    coreConfigTemplate: true,
    rawConfigValidation: true,
    keyGeneration: true,
    formDrafts: true,
    clientLinks: false,
    supportsMultipleInstances: false,
    requiresServerPKI: false
  },
  createDefaultConfigJson,
  validateConfig
};
