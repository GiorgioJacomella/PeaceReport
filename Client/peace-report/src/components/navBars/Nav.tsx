import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserInfoAPI, UserInfoResponse } from '@/src/api';
import ErrorModal from '@/src/components/modals/Modal';

type NavbarProps = {};

const Nav: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfoAPI();
        setUserInfo(user);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const getOpacity = (path: string) => {
    return router.pathname === path ? 1 : 0.5;
  };

  if (loading) return null;

  return (
    <>
      {error && (
        <ErrorModal errorMessage={error} onClose={() => setError(null)} />
      )}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-xl z-50 md:top-0 md:bottom-auto md:flex md:justify-between md:items-center p-4 md:p-2">
        <div className="hidden md:flex md:justify-start md:w-auto">
          <a href='/myview' className="flex items-center">
            <img src="/logo.png" alt='Logo' style={{ height: '3rem' }} />
          </a>
        </div>
        <ul className="flex justify-around w-full md:w-auto md:flex-row md:flex md:items-center gap-4">
          <li className="flex-1 text-center">
            <a href="/myview" className="block py-2">
              <img
                src="/icons/home.png"
                alt="Home"
                className="mx-auto w-8 h-8 md:w-8 md:h-8"
                style={{ opacity: getOpacity('/myview') }}
              />
            </a>
          </li>
          {userInfo?.journalist && (
            <li className="flex-1 text-center">
              <a href="/myview/myArticle" className="block py-2">
                <img
                  src="/icons/create.png"
                  alt="Create Article"
                  className="mx-auto w-8 h-8 md:w-8 md:h-8"
                  style={{ opacity: getOpacity('/myview/myArticle') }}
                />
              </a>
            </li>
          )}
          <li className="flex-1 text-center">
            <a href="/myview/myAccount" className="block py-2">
              <img
                src="/icons/user.png"
                alt="My Account"
                className="mx-auto w-8 h-8 md:w-8 md:h-8"
                style={{ opacity: getOpacity('/myview/myAccount') }}
              />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
