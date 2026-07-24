import { singBoxKit } from "./singbox-kit.js";
import { wireGuardKit } from "./wireguard-kit.js";
import { xrayKit } from "./xray-kit.js";
import type {
  CoreConfigTemplateResult,
  CoreKind,
  CoreKit,
  CoreKitValidationOptions,
  CoreKitValidationResult
} from "./types.js";

export type {
  CoreConfigTemplateResult,
  CoreKind,
  CoreKit,
  CoreKitCapabilities,
  CoreKitValidationIssue,
  CoreKitValidationOptions,
  CoreKitValidationResult
} from "./types.js";

export const supportedCoreKinds = ["xray", "wg", "singbox"] as const satisfies readonly CoreKind[];

export const coreKits = {
  xray: xrayKit,
  wg: wireGuardKit,
  singbox: singBoxKit
} as const satisfies Record<CoreKind, CoreKit>;

export function getCoreKit(kind: CoreKind): CoreKit {
  const kit = coreKits[kind];
  if (!kit) {
    throw new Error(`Unsupported core kind: ${String(kind)}`);
  }
  return kit;
}

export function createCoreConfigTemplate(kind: CoreKind): CoreConfigTemplateResult {
  return getCoreKit(kind).createDefaultConfigJson();
}

export function validateCoreConfig(
  kind: CoreKind,
  input: unknown,
  options?: CoreKitValidationOptions
): CoreKitValidationResult {
  return getCoreKit(kind).validateConfig(input, options);
}

export * as xray from "@pasarguard/xray-config-kit";
export * as wireguard from "@pasarguard/wireguard-config-kit";
export * as singbox from "@pasarguard/singbox-config-kit";

