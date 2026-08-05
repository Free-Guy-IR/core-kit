import type { CoreConfigTemplateResult, CoreKind, CoreKit, CoreKitValidationOptions, CoreKitValidationResult } from "./types.js";
export type { CoreConfigTemplateResult, CoreKind, CoreKit, CoreKitCapabilities, CoreKitValidationIssue, CoreKitValidationOptions, CoreKitValidationResult } from "./types.js";
export declare const supportedCoreKinds: readonly ["xray", "wg", "singbox", "openvpn", "mtproto"];
export declare const coreKits: {
    readonly xray: CoreKit<import("@pasarguard/xray-config-kit").XrayConfig>;
    readonly wg: CoreKit<import("@pasarguard/wireguard-config-kit").WireGuardCoreConfig>;
    readonly singbox: CoreKit<import("@pasarguard/singbox-config-kit").SingBoxCoreConfig>;
    readonly openvpn: CoreKit<import("@pasarguard/openvpn-config-kit").OpenVPNCoreConfig>;
    readonly mtproto: CoreKit<import("@pasarguard/mtproto-config-kit").MTProtoCoreConfig>;
};
export declare function getCoreKit(kind: CoreKind): CoreKit;
export declare function createCoreConfigTemplate(kind: CoreKind): CoreConfigTemplateResult;
export declare function validateCoreConfig(kind: CoreKind, input: unknown, options?: CoreKitValidationOptions): CoreKitValidationResult;
export * as xray from "@pasarguard/xray-config-kit";
export * as wireguard from "@pasarguard/wireguard-config-kit";
export * as singbox from "@pasarguard/singbox-config-kit";
export * as openvpn from "@pasarguard/openvpn-config-kit";
export * as mtproto from "@pasarguard/mtproto-config-kit";
//# sourceMappingURL=index.d.ts.map