import { createDefaultMTProtoCoreDraft, validateMTProtoCoreConfig } from "@pasarguard/mtproto-config-kit";
import { parseConfigInput } from "./json.js";
function mapMTProtoIssue(issue) {
    return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
        severity: "error"
    };
}
function createDefaultConfigJson() {
    const draft = createDefaultMTProtoCoreDraft();
    return {
        kind: "mtproto",
        configJson: JSON.stringify({
            instances: draft.instances.map(i => ({
                tag: i.tag,
                port: i.port,
                fake_tls_domain: i.fakeTlsDomain
            }))
        }, null, 2)
    };
}
function validateConfig(input) {
    const parsed = parseConfigInput(input);
    if (!parsed.ok)
        return parsed;
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
export const mtprotoKit = {
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
//# sourceMappingURL=mtproto-kit.js.map