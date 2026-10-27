import { describe, expect, test } from "bun:test";
import { createCoreConfigTemplate, validateCoreConfig, xray } from "@pasarguard/core-kit";
import * as xraySubpath from "@pasarguard/core-kit/xray";

const releaseTags = () => xray.getXrayParityReleases().map((release) => release.tag);

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
});
