import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type LockWorkspace = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type Lockfile = {
  workspaces: Record<string, LockWorkspace>;
  packages: Record<string, unknown[]>;
};

const root = join(import.meta.dir, "..");
const lockPath = join(root, "bun.lock");
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

async function loadLock(): Promise<Lockfile> {
  const module = (await import(lockPath)) as { default: Lockfile };
  return module.default;
}

describe("bun.lock", () => {
  test("is committed and not ignored", () => {
    expect(existsSync(lockPath)).toBe(true);
    const ignored = readFileSync(join(root, ".gitignore"), "utf8")
      .split("\n")
      .map((line) => line.trim());
    expect(ignored).not.toContain("bun.lock");
  });

  test("resolves exactly the dependencies package.json declares", async () => {
    const workspace = (await loadLock()).workspaces[""];
    expect(workspace?.dependencies).toEqual(manifest.dependencies);
    expect(workspace?.devDependencies).toEqual(manifest.devDependencies);
  });

  test("resolves every sibling kit from the folder beside core-kit", async () => {
    const lock = await loadLock();
    const siblings = Object.entries(manifest.dependencies).filter(([, spec]) => spec.startsWith("file:../"));
    expect(siblings.length).toBeGreaterThan(0);
    for (const [name, spec] of siblings) {
      expect(lock.packages[name]?.[0]).toBe(`${name}@${spec}`);
    }
  });

  test("records the dependencies each sibling kit declares today", async () => {
    const lock = await loadLock();
    const siblings = Object.entries(manifest.dependencies).filter(([, spec]) => spec.startsWith("file:../"));
    for (const [name, spec] of siblings) {
      const sibling = JSON.parse(readFileSync(join(root, spec.slice("file:".length), "package.json"), "utf8")) as {
        dependencies?: Record<string, string>;
      };
      const recorded = lock.packages[name]?.[1] as { dependencies?: Record<string, string> } | undefined;
      expect({ [name]: recorded?.dependencies ?? {} }).toEqual({ [name]: sibling.dependencies ?? {} });
    }
  });

  test("pins every registry dependency to one exact version", async () => {
    const lock = await loadLock();
    const registry = Object.entries(manifest.dependencies).filter(([, spec]) => !spec.startsWith("file:"));
    expect(registry.length).toBeGreaterThan(0);
    for (const [name, spec] of registry) {
      expect(spec).toMatch(/^\d+\.\d+\.\d+$/);
      expect(lock.packages[name]?.[0]).toBe(`${name}@${spec}`);
    }
  });
});
