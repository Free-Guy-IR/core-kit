import { createDefaultMTProtoCoreDraft, validateMTProtoCoreConfig } from "@pasarguard/mtproto-config-kit";
import { parseConfigInput } from "./json.js";
import type {
  CoreConfigTemplateResult,
  CoreKit,
  CoreKitValidationIssue,
  CoreKitValidationResult
} from "./types.js";
import type { MTProtoCoreConfig } from "@pasarguard/mtproto-config-kit";

function mapMTProtoIssue(issue: {
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
  const draft = createDefaultMTProtoCoreDraft();
  return {
    kind: "mtproto",
    configJson: JSON.stringify(
      {
        instances: draft.instances.map(i => ({
          tag: i.tag,
          port: i.port,
          fake_tls_domain: i.fakeTlsDomain
        }))
      },
      null,
      2
    )
  };
}

function validateConfig(input: unknown): CoreKitValidationResult<MTProtoCoreConfig> {
  const parsed = parseConfigInput(input);
  if (!parsed.ok) return parsed;

  const result = validateMTProtoCoreConfig(parsed.config);
  if (result.ok) {
    return {
      ok: true,
      config: result.config,
      issues: []
    };
  }

  return {
    ok: false,
    issues: result.issues.map(mapMTProtoIssue)
  };
}

export const mtprotoKit: CoreKit<MTProtoCoreConfig> = {
  kind: "mtproto",
  label: "MTProto",
  browserSafe: true,
  capabilities: {
    coreConfigTemplate: true,
    rawConfigValidation: true,
    keyGeneration: false,
    formDrafts: true,
    clientLinks: false,
    supportsMultipleInstances: true,
    requiresServerPKI: false
  },
  createDefaultConfigJson,
  validateConfig
};
