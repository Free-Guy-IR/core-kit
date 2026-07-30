import { describe, expect, test } from "bun:test";
import {
  coreKits,
  createCoreConfigTemplate,
  getCoreKit,
  openvpn,
  singbox,
  supportedCoreKinds,
  validateCoreConfig,
  wireguard,
  xray
} from "@pasarguard/core-kit";

describe("core registry", () => {
  test("exposes stable supported core kinds", () => {
    expect(supportedCoreKinds).toEqual(["xray", "wg", "singbox", "openvpn"]);
    expect(coreKits.xray.kind).toBe("xray");
    expect(coreKits.wg.kind).toBe("wg");
    expect(coreKits.singbox.kind).toBe("singbox");
    expect(coreKits.openvpn.kind).toBe("openvpn");
    expect(getCoreKit("xray").label).toBe("Xray");
    expect(getCoreKit("wg").label).toBe("WireGuard");
    expect(getCoreKit("singbox").label).toBe("Sing-box");
    expect(getCoreKit("openvpn").label).toBe("OpenVPN");
  });

  test("OpenVPN kit capabilities flag multi-instance + server PKI", () => {
    expect(coreKits.openvpn.capabilities.supportsMultipleInstances).toBe(true);
    expect(coreKits.openvpn.capabilities.requiresServerPKI).toBe(true);
  });

  test("creates and validates default Xray JSON through the facade", () => {
    const template = createCoreConfigTemplate("xray");
    expect(template.kind).toBe("xray");

    const parsed = JSON.parse(template.configJson) as { inbounds?: unknown[]; outbounds?: unknown[] };
    expect(Array.isArray(parsed.inbounds)).toBe(true);
    expect(Array.isArray(parsed.outbounds)).toBe(true);

    const result = validateCoreConfig("xray", template.configJson);
    expect(result.ok).toBe(true);
  });

  test("creates and validates default WireGuard JSON through the facade", () => {
    const template = createCoreConfigTemplate("wg");
    expect(template.kind).toBe("wg");
    expect(template.generated?.wireGuardKeyPair).toBeTruthy();

    const parsed = JSON.parse(template.configJson) as { interface_name?: string; private_key?: string };
    expect(parsed.interface_name).toBe("wg0");
    expect(typeof parsed.private_key).toBe("string");

    const result = validateCoreConfig("wg", template.configJson);
    expect(result.ok).toBe(true);
  });

  test("normalizes JSON parse failures", () => {
    const result = validateCoreConfig("wg", "{not json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("CORE_KIT_INVALID_JSON");
    }
  });

  test("delegates Xray validation failures", () => {
    const result = validateCoreConfig("xray", []);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.code).toBe("XCK_XRAY_STRICT_EXPECTED_OBJECT");
    }
  });

  test("delegates WireGuard validation failures", () => {
    const result = validateCoreConfig("wg", {
      interface_name: "wg0",
      private_key: "bad",
      listen_port: 51820,
      address: ["10.0.0.1/8"]
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]?.code).toMatch(/^WG_/);
    }
  });

  test("creates and validates default sing-box (Hysteria2) JSON through the facade", () => {
    const template = createCoreConfigTemplate("singbox");
    expect(template.kind).toBe("singbox");

    const parsed = JSON.parse(template.configJson) as { inbounds?: unknown[]; outbounds?: unknown[] };
    expect(Array.isArray(parsed.inbounds)).toBe(true);
    expect(Array.isArray(parsed.outbounds)).toBe(true);

    const result = validateCoreConfig("singbox", template.configJson);
    expect(result.ok).toBe(true);
  });

  test("delegates sing-box validation failures (hysteria2 requires tls.enabled)", () => {
    const result = validateCoreConfig("singbox", {
      inbounds: [{ type: "hysteria2", tag: "a", listen_port: 8443, tls: { enabled: false } }],
      outbounds: [{ type: "direct" }]
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]?.code).toMatch(/^SB_/);
    }
  });

  test("creates and validates default OpenVPN JSON through the facade", () => {
    const template = createCoreConfigTemplate("openvpn");
    expect(template.kind).toBe("openvpn");

    const parsed = JSON.parse(template.configJson) as { instances?: unknown[]; pki?: unknown };
    expect(Array.isArray(parsed.instances)).toBe(true);
    expect(parsed.pki).toBeTruthy();

    // The default template's pki is intentionally empty (server-generated), so it does not
    // validate as a saveable config until PKI has been generated - this mirrors the panel
    // rejecting an incomplete pki section.
    const result = validateCoreConfig("openvpn", template.configJson);
    expect(result.ok).toBe(false);
  });

  test("delegates OpenVPN validation failures (duplicate protocol/port pair)", () => {
    const result = validateCoreConfig("openvpn", {
      instances: [
        { tag: "a", protocol: "udp", port: 1194, network: "10.8.0.0/24" },
        { tag: "b", protocol: "udp", port: 1194, network: "10.9.0.0/24" }
      ],
      pki: { ca_cert: "x", server_cert: "x", server_key: "x", tls_crypt_key: "x" }
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]?.code).toMatch(/^OV_/);
    }
  });

  test("delegates OpenVPN validation success with a complete config", () => {
    const result = validateCoreConfig("openvpn", {
      instances: [{ tag: "udp-main", protocol: "udp", port: 1194, network: "10.8.0.0/24" }],
      pki: { ca_cert: "x", server_cert: "x", server_key: "x", tls_crypt_key: "x" }
    });
    expect(result.ok).toBe(true);
  });

  test("re-exports underlying browser-safe namespaces", () => {
    expect(typeof xray.createDefaultXrayCoreConfigJson).toBe("function");
    expect(typeof wireguard.generateWireGuardKeyPair).toBe("function");
    expect(typeof singbox.createDefaultSingBoxCoreDraft).toBe("function");
    expect(typeof openvpn.createDefaultOpenVPNCoreDraft).toBe("function");
  });
});

