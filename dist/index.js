import { mtprotoKit } from "./mtproto-kit.js";
import { openVPNKit } from "./openvpn-kit.js";
import { singBoxKit } from "./singbox-kit.js";
import { wireGuardKit } from "./wireguard-kit.js";
import { xrayKit } from "./xray-kit.js";
export const supportedCoreKinds = ["xray", "wg", "singbox", "openvpn", "mtproto"];
export const coreKits = {
    xray: xrayKit,
    wg: wireGuardKit,
    singbox: singBoxKit,
    openvpn: openVPNKit,
    mtproto: mtprotoKit
};
export function getCoreKit(kind) {
    const kit = coreKits[kind];
    if (!kit) {
        throw new Error(`Unsupported core kind: ${String(kind)}`);
    }
    return kit;
}
export function createCoreConfigTemplate(kind) {
    return getCoreKit(kind).createDefaultConfigJson();
}
export function validateCoreConfig(kind, input, options) {
    return getCoreKit(kind).validateConfig(input, options);
}
export * as xray from "@pasarguard/xray-config-kit";
export * as wireguard from "@pasarguard/wireguard-config-kit";
export * as singbox from "@pasarguard/singbox-config-kit";
export * as openvpn from "@pasarguard/openvpn-config-kit";
export * as mtproto from "@pasarguard/mtproto-config-kit";
//# sourceMappingURL=index.js.map