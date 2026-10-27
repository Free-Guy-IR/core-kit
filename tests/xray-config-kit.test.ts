import { describe, expect, test } from "bun:test";
import { createCoreConfigTemplate, validateCoreConfig, xray } from "@pasarguard/core-kit";
import * as xraySubpath from "@pasarguard/core-kit/xray";

const releaseTags = () => xray.getXrayParityReleases().map((release) => release.tag);

const masqueConfig = {
  inbounds: [
    {
      protocol: "masque",
      tag: "masque-in",
      port: 443,
      settings: {
        users: [{ email: "alice@example.com", pass: "alice-masque-pass-1", level: 0 }],
        address: ["10.14.0.1/16"],
        mtu: 1400
      },
      streamSettings: {
        network: "masque",
        security: "tls",
        tlsSettings: { alpn: ["h3", "h2"], certificates: [{ certificateFile: "/c.pem", keyFile: "/k.pem" }] },
        masqueSettings: { path: "/.well-known/masque/ip/{target}/{ipproto}/" }
      }
    }
  ],
  outbounds: [{ protocol: "freedom", tag: "direct" }]
};

const finalmaskFilterConfig = {
  inbounds: [
    {
      protocol: "vless",
      tag: "vless-filter",
      port: 443,
      settings: { clients: [], decryption: "none" },
      streamSettings: {
        network: "tcp",
        security: "none",
        finalmask: { tcp: [{ type: "filter", settings: { blockedSourceIPs: ["192.0.2.0/24", "geoip:private"] } }] }
      }
    }
  ],
  outbounds: [{ protocol: "freedom", tag: "direct" }]
};

function expectValidFor(xrayVersion: string, input: unknown) {
  const result = validateCoreConfig("xray", input, { xrayVersion });
  expect({ xrayVersion, issues: result.issues }).toEqual({ xrayVersion, issues: [] });
  expect(result.ok).toBe(true);
}

describe("xray-config-kit through the facade", () => {
  test("validates the default Xray config for Xray v26.10.17", () => {
    expect(releaseTags()).toContain("v26.10.17");
    expectValidFor("26.10.17", createCoreConfigTemplate("xray").configJson);
  });

  test("reads verifyPeerCertByName as Xray v26.10.17 writes it", () => {
    expect(xray.coerceVerifyPeerCertByNameList("a.example, b.example")).toEqual(["a.example", "b.example"]);
    expect(xraySubpath.coerceVerifyPeerCertByNameList(["c.example", " "])).toEqual(["c.example"]);
    expect(xraySubpath.stringifyVerifyPeerCertByName(["a.example", "b.example"])).toBe("a.example,b.example");
  });

  test("models a MASQUE inbound when importing Xray JSON", () => {
    expectValidFor("26.10.17", masqueConfig);
    const imported = xray.importXrayConfig(masqueConfig);
    const inbound = imported.profile?.inbounds?.[0] as { protocol?: string; transport?: { type?: string } } | undefined;
    expect(inbound?.protocol).toBe("masque");
    expect(inbound?.transport?.type).toBe("masque");
    expect(xraySubpath.MASQUE_DEFAULTS.path).toBe("/.well-known/masque/ip/*/*/");
    expect(xray.expandMasquePathTemplate("/.well-known/masque/ip/{target}/{ipproto}/")).toBe("/.well-known/masque/ip/*/*/");
    expect(xray.XDRIVE_SERVICES).toContain("google-drive");
  });

  test("validates Xray v26.10.21 and its finalmask filter only from that release", () => {
    expect(releaseTags()).toContain("v26.10.21");
    expectValidFor("26.10.21", createCoreConfigTemplate("xray").configJson);
    expectValidFor("26.10.21", finalmaskFilterConfig);

    const before = validateCoreConfig("xray", finalmaskFilterConfig, { xrayVersion: "26.10.17" });
    expect(before.ok).toBe(false);
    expect(before.issues.map((issue) => issue.code)).toContain("XCK_XRAY_STRICT_UNKNOWN_FINALMASK");
  });
});
