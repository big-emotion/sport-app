'use client';

import React from 'react';

import { useWithAuth } from '@/utils/withAuth';

import LoginButton from './LoginButton';
import UserMenu from './UserMenu';

export default function AccountWidget(): React.ReactElement | null {
  const { user, isLoading } = useWithAuth();

  if (isLoading) {
    return null;
  }

  return user ? <UserMenu user={user} /> : <LoginButton />;
}
