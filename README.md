# PasarGuard Core Kit

> Note: This is the [Free-Guy-IR](https://github.com/Free-Guy-IR) fork of the original [PasarGuard core-kit](https://github.com/PasarGuard/core-kit), registering sing-box and OpenVPN core kits alongside Xray/WireGuard.

Browser-safe TypeScript registry facade for PasarGuard core configuration packages.

## Package

```ts
import {
  createCoreConfigTemplate,
  getCoreKit,
  validateCoreConfig
} from "@pasarguard/core-kit";

const template = createCoreConfigTemplate("xray");
const result = validateCoreConfig("xray", template.configJson);
```

## Direct Imports

```ts
import { createDefaultXrayCoreConfigJson } from "@pasarguard/core-kit/xray/generators";
import { generateWireGuardKeyPair } from "@pasarguard/core-kit/wireguard";
```

## Commands

```powershell
bun install
bun run typecheck
bun run build
bun test
```

## Supported Core Kinds

- `xray`
- `wg`
