import { createDefaultWireGuardCoreDraft, generateWireGuardCoreConfigJsonFromDraft, validateWireGuardCoreConfig } from "@pasarguard/wireguard-config-kit";
import { parseConfigInput } from "./json.js";
function mapWireGuardIssue(issue) {
    return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
        severity: "error"
    };
}
function createDefaultConfigJson() {
    const draft = createDefaultWireGuardCoreDraft();
    return {
        kind: "wg",
        configJson: generateWireGuardCoreConfigJsonFromDraft(draft),
        generated: {
            wireGuardKeyPair: {
                privateKey: draft.privateKey,
                publicKey: draft.publicKey
            }
        }
    };
}
function validateConfig(input) {
    const parsed = parseConfigInput(input);
    if (!parsed.ok)
        return parsed;
    const result = validateWireGuardCoreConfig(parsed.config);
    if (result.ok) {
        return {
            ok: true,
            config: result.config,
            issues: []
        };
    }
    return {
        ok: false,
        issues: result.issues.map(mapWireGuardIssue)
    };
}
export const wireGuardKit = {
    kind: "wg",
    label: "WireGuard",
    browserSafe: true,
    capabilities: {
        coreConfigTemplate: true,
        rawConfigValidation: true,
        keyGeneration: true,
        formDrafts: true,
        clientLinks: false
    },
    createDefaultConfigJson,
    validateConfig
};
//# sourceMappingURL=wireguard-kit.js.map