import { createDefaultSingBoxCoreDraft, generateSingBoxCoreConfigJsonFromDraft, validateSingBoxCoreConfig } from "@pasarguard/singbox-config-kit";
import { parseConfigInput } from "./json.js";
function mapSingBoxIssue(issue) {
    return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
        severity: "error"
    };
}
function createDefaultConfigJson() {
    const draft = createDefaultSingBoxCoreDraft();
    return {
        kind: "singbox",
        configJson: generateSingBoxCoreConfigJsonFromDraft(draft)
    };
}
function validateConfig(input) {
    const parsed = parseConfigInput(input);
    if (!parsed.ok)
        return parsed;
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
export const singBoxKit = {
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
//# sourceMappingURL=singbox-kit.js.map