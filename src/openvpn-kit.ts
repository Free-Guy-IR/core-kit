import { createDefaultOpenVPNCoreDraft, validateOpenVPNCoreConfig } from "@pasarguard/openvpn-config-kit";
import { parseConfigInput } from "./json.js";
import type {
  CoreConfigTemplateResult,
  CoreKit,
  CoreKitValidationIssue,
  CoreKitValidationResult
} from "./types.js";
import type { OpenVPNCoreConfig } from "@pasarguard/openvpn-config-kit";

function mapOpenVPNIssue(issue: {
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
  const draft = createDefaultOpenVPNCoreDraft();
  // The default draft's pki is intentionally empty (PKI is server-generated), so this
  // template is not directly saveable as-is - callers use the visual editor's "Generate
  // PKI" action first. We still emit the instances section as valid JSON here so the
  // Advanced/JSON tab has something sensible to show before that happens.
  return {
    kind: "openvpn",
    configJson: JSON.stringify(
      {
        instances: draft.instances.map(i => ({
          tag: i.tag,
          protocol: i.protocol,
          port: i.port,
          network: i.network,
          cipher: i.cipher,
          auth: i.auth,
          keepalive: i.keepalive,
          redirect_gateway: i.redirectGateway,
          duplicate_cn: i.duplicateCN
        })),
        pki: { ca_cert: "", server_cert: "", server_key: "", tls_crypt_key: "" }
      },
      null,
      2
    )
  };
}

function validateConfig(input: unknown): CoreKitValidationResult<OpenVPNCoreConfig> {
  const parsed = parseConfigInput(input);
  if (!parsed.ok) return parsed;

  const result = validateOpenVPNCoreConfig(parsed.config);
  if (result.ok) {
    return {
      ok: true,
      config: result.config,
      issues: []
    };
  }

  return {
    ok: false,
    issues: result.issues.map(mapOpenVPNIssue)
  };
}

export const openVPNKit: CoreKit<OpenVPNCoreConfig> = {
  kind: "openvpn",
  label: "OpenVPN",
  browserSafe: true,
  capabilities: {
    coreConfigTemplate: true,
    rawConfigValidation: true,
    keyGeneration: false,
    formDrafts: true,
    clientLinks: false,
    supportsMultipleInstances: true,
    requiresServerPKI: true
  },
  createDefaultConfigJson,
  validateConfig
};
