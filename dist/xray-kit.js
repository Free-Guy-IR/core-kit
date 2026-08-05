import { createDefaultXrayCoreConfigJson, validateStrictXrayConfig } from "@pasarguard/xray-config-kit";
import { parseConfigInput } from "./json.js";
function mapXrayIssue(issue) {
    return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
        severity: issue.severity
    };
}
function createDefaultConfigJson() {
    return {
        kind: "xray",
        configJson: createDefaultXrayCoreConfigJson()
    };
}
function validateConfig(input, options = {}) {
    const parsed = parseConfigInput(input);
    if (!parsed.ok)
        return parsed;
    const result = validateStrictXrayConfig(parsed.config, {
        xrayVersion: options.xrayVersion
    });
    if (result.ok && result.config && result.issues.length === 0) {
        return {
            ok: true,
            config: result.config,
            issues: []
        };
    }
    return {
        ok: false,
        issues: result.issues.map(mapXrayIssue)
    };
}
export const xrayKit = {
    kind: "xray",
    label: "Xray",
    browserSafe: true,
    capabilities: {
        coreConfigTemplate: true,
        rawConfigValidation: true,
        keyGeneration: true,
        formDrafts: true,
        clientLinks: true
    },
    createDefaultConfigJson,
    validateConfig
};
//# sourceMappingURL=xray-kit.js.map