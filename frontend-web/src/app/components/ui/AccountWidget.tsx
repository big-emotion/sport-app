'use client';

import React, { useEffect, useState } from 'react';

import { User, withAuth } from '@/utils/withAuth';

import LoginButton from './LoginButton';
import UserMenu from './UserMenu';

export default function AccountWidget(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const authUser = await withAuth();
      setUser(authUser);
    })();
  }, []);

  return user ? <UserMenu user={user} /> : <LoginButton />;
}
