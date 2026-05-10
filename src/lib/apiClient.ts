/**
 * @file apiClient.ts
 * @description API Gateway への fetch ラッパ。NEXT_PUBLIC_API_BASE_URL をベース URL として使用する。
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API error ${status}`);
  }
}

/**
 * NEXT_PUBLIC_API_BASE_URL + path へ fetch し、レスポンスを T として返す。
 * 非 2xx のとき ApiError を throw する。
 */
export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const url = `${base}${path}`;
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (init?.body) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
};

/** 認証なし dev 環境用のユーザー ID。Cognito 導入時はこの関数だけ差し替える。 */
export const getCurrentUserId = (): string =>
  process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? 'demo-user';
