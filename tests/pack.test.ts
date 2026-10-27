import { afterEach, describe, expect, test } from "bun:test";
import { cp, mkdir, mkdtemp, readdir, rm, symlink } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
let tempDir: string | undefined;

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe("npm pack", () => {
  test("ships a freshly built dist from a tree that has none", async () => {
    const tempRoot = join(root, "tests", ".tmp");
    await mkdir(tempRoot, { recursive: true });
    tempDir = await mkdtemp(join(tempRoot, "pack-"));
    const tree = join(tempDir, "tree");
    const out = join(tempDir, "out");
    await mkdir(tree);
    await mkdir(out);
    for (const entry of ["package.json", "tsconfig.json", "README.md", "LICENSE", "src"]) {
      await cp(join(root, entry), join(tree, entry), { recursive: true });
    }
    await symlink(join(root, "node_modules"), join(tree, "node_modules"), "dir");

    const packed = Bun.spawnSync(["npm", "pack", "--pack-destination", out], { cwd: tree, stdout: "pipe", stderr: "pipe" });
    expect({ exitCode: packed.exitCode, stderr: packed.exitCode === 0 ? "" : packed.stderr.toString() }).toEqual({ exitCode: 0, stderr: "" });

    const tarballs = (await readdir(out)).filter((name) => name.endsWith(".tgz"));
    expect(tarballs.length).toBe(1);
    const listed = Bun.spawnSync(["tar", "-tzf", join(out, tarballs[0]!)], { stdout: "pipe", stderr: "pipe" });
    expect(listed.exitCode).toBe(0);
    const files = listed.stdout.toString().split("\n").filter(Boolean);
    for (const file of ["package/dist/index.js", "package/dist/index.d.ts", "package/dist/xray.js", "package/dist/l2tp.js", "package/package.json"]) {
      expect(files).toContain(file);
    }
  }, 120_000);
});
