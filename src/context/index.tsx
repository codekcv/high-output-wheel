import { useLazyQuery } from '@apollo/client';
import { User } from '@prisma/client';
import { USERS } from 'src/constants/queries';
import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext<{ [key: string]: any }>({});

export const AppProvider: React.FC = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [loadUsers, { called, error, loading, refetch }] = useLazyQuery(USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setUsers(
        data.users.map((user: User) => ({
          name: user.name,
          img: user.img,
          id: user.id,
          done: user.done,
          sharer: user.sharer,
        }))
      );
    },
  });

  const value = useMemo(
    () => ({ setUsers, users, setReadOnly, readOnly, refetch, loading }),
    [users, readOnly, loading, refetch]
  );

  if (!called) loadUsers();
  if (error) return <span>{`Error! ${error.message}`}</span>;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
