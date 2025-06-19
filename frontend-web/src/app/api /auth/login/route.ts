import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;

  try {
    // 🔐 Appel à ton backend (ex: vers ton service ou base de données)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();

      return res.status(401).json({ message });
    }

    const { token, user } = await response.json();

    // ✅ Définir le cookie HttpOnly ici
    setCookie('token', token, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 jour
    });

    return res.status(200).json({ user });
  } catch {
    return res.status(500).json({
      message: 'Erreur interne du serveur',
    });
  }
}
