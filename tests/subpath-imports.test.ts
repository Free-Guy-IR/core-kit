import { describe, expect, test } from "bun:test";

describe("package subpaths", () => {
  test("loads root and subpath exports", async () => {
    const root = await import("@pasarguard/core-kit");
    const xray = await import("@pasarguard/core-kit/xray");
    const xrayGenerators = await import("@pasarguard/core-kit/xray/generators");
    const wireguard = await import("@pasarguard/core-kit/wireguard");
    const singbox = await import("@pasarguard/core-kit/singbox");

    expect(typeof root.createCoreConfigTemplate).toBe("function");
    expect(typeof xray.validateStrictXrayConfig).toBe("function");
    expect(typeof xrayGenerators.createDefaultXrayCoreConfigJson).toBe("function");
    expect(typeof wireguard.generateWireGuardKeyPair).toBe("function");
    expect(typeof singbox.createDefaultSingBoxCoreDraft).toBe("function");
  });
});

