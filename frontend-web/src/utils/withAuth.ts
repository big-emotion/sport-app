export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function withAuth(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}
