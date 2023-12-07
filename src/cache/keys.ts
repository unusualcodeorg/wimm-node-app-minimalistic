export enum Key {
  CONTENTS_LATEST = 'CONTENTS_LATEST',
}

export enum DynamicKey {
  CONTENTS_SIMILAR = 'CONTENTS_SIMILAR',
  CONTENT = 'CONTENT',
}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
