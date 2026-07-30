export type CoreKind = "xray" | "wg" | "singbox" | "openvpn";

export type CoreKitValidationIssue = {
  readonly code: string;
  readonly path: string;
  readonly message: string;
  readonly severity?: "error" | "warning" | "info";
};

export type CoreKitValidationResult<T = unknown> =
  | {
      readonly ok: true;
      readonly config: T;
      readonly issues: readonly [];
    }
  | {
      readonly ok: false;
      readonly issues: readonly CoreKitValidationIssue[];
    };

export type CoreConfigTemplateResult = {
  readonly kind: CoreKind;
  readonly configJson: string;
  readonly generated?: Record<string, unknown>;
};

export type CoreKitCapabilities = {
  readonly coreConfigTemplate: boolean;
  readonly rawConfigValidation: boolean;
  readonly keyGeneration: boolean;
  readonly formDrafts: boolean;
  readonly clientLinks: boolean;
  /** True when a single core config can hold more than one independent listener/instance (e.g. OpenVPN's instances list). Optional so existing kits are unaffected. */
  readonly supportsMultipleInstances?: boolean;
  /** True when the core config needs server-generated PKI material before it can be saved (e.g. OpenVPN's CA/cert/key/tls-crypt bundle). Optional so existing kits are unaffected. */
  readonly requiresServerPKI?: boolean;
};

export type CoreKitValidationOptions = {
  readonly xrayVersion?: string;
};

export type CoreKit<T = unknown> = {
  readonly kind: CoreKind;
  readonly label: string;
  readonly browserSafe: true;
  readonly capabilities: CoreKitCapabilities;
  createDefaultConfigJson(): CoreConfigTemplateResult;
  validateConfig(input: unknown, options?: CoreKitValidationOptions): CoreKitValidationResult<T>;
};

