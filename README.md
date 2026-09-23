# PasarGuard Core Kit

> Note: This is the [Free-Guy-IR](https://github.com/Free-Guy-IR) fork of the original [PasarGuard core-kit](https://github.com/PasarGuard/core-kit), registering sing-box, OpenVPN, MTProto and L2TP core kits alongside Xray/WireGuard.

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

Each kit is also re-exported as a namespace from the root: `xray`, `wireguard`, `singbox`,
`openvpn`, `mtproto` and `l2tp`.

## Direct Imports

```ts
import { createDefaultXrayCoreConfigJson } from "@pasarguard/core-kit/xray/generators";
import { generateWireGuardKeyPair } from "@pasarguard/core-kit/wireguard";
import { createDefaultSingBoxCoreDraft } from "@pasarguard/core-kit/singbox";
import { createDefaultOpenVPNCoreDraft } from "@pasarguard/core-kit/openvpn";
import { createDefaultL2TPCoreDraft } from "@pasarguard/core-kit/l2tp";
```

The package exports `.`, `./xray`, `./xray/generators`, `./wireguard`, `./singbox`,
`./openvpn` and `./l2tp`. MTProto has no subpath export; use the root `mtproto` namespace.

## Commands

The sing-box, OpenVPN, MTProto, L2TP and WireGuard kits are `file:` dependencies, so clone
them next to this repository before installing:

```text
wireguard-config-kit/
singbox-config-kit/
openvpn-config-kit/
mtproto-config-kit/
l2tp-config-kit/
core-kit/
```

```bash
bun install
bun run typecheck
bun run build
bun test
```

A standalone install from a git URL does not work, because the sibling kits are `file:`
dependencies that only resolve when those directories sit next to this one. Consumers such as
the panel clone every kit side by side at pinned commits and run `bun install` in each.

`dist/` is committed, so a consumer that clones the kits side by side does not need to build
this one; rebuild it with `bun run build` whenever `src/` changes.

## Supported Core Kinds

- `xray`
- `wg`
- `singbox`
- `openvpn`
- `mtproto`
- `l2tp`
