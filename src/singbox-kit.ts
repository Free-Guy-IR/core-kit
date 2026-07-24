import {
  createDefaultSingBoxCoreDraft,
  generateSingBoxCoreConfigJsonFromDraft,
  validateSingBoxCoreConfig
} from "@pasarguard/singbox-config-kit";
import { parseConfigInput } from "./json.js";
import type {
  CoreConfigTemplateResult,
  CoreKit,
  CoreKitValidationIssue,
  CoreKitValidationResult
} from "./types.js";
import type { SingBoxCoreConfig } from "@pasarguard/singbox-config-kit";

function mapSingBoxIssue(issue: {
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
  const draft = createDefaultSingBoxCoreDraft();
  return {
    kind: "singbox",
    configJson: generateSingBoxCoreConfigJsonFromDraft(draft)
  };
}

function validateConfig(input: unknown): CoreKitValidationResult<SingBoxCoreConfig> {
  const parsed = parseConfigInput(input);
  if (!parsed.ok) return parsed;

  const result = validateSingBoxCoreConfig(parsed.config);
  if (result.ok) {
    return {
      ok: true,
      config: result.config,
      issues: []
    };
  }

  return {
    ok: false,
    issues: result.issues.map(mapSingBoxIssue)
  };
}

export const singBoxKit: CoreKit<SingBoxCoreConfig> = {
  kind: "singbox",
  label: "Sing-box",
  browserSafe: true,
  capabilities: {
    coreConfigTemplate: true,
    rawConfigValidation: true,
    keyGeneration: false,
    formDrafts: true,
    clientLinks: false
  },
  createDefaultConfigJson,
  validateConfig
};
