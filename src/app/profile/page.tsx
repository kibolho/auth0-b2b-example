'use client';

import { Loading } from "@/components/Loading";
import { useAuth } from "@/hooks";
import Image from "next/image";
import { redirect } from 'next/navigation'

const Profile = () => {
  const { user, isLoading, isAuthenticated, logout,tokenMetadata} = useAuth();
  if(!isAuthenticated && !isLoading)
    return redirect('/')

  if(isLoading){
    return <div className="flex flex-1 justify-center align-center">
      <Loading />
    </div>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="space-y-2 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mr-2 w-8 h-8 relative">
          {user?.picture && <Image
            src={user.picture}
            alt="Profile"
            layout="fill" // required
            objectFit="cover" // change to suit your needs
            className="rounded-full" // just an example
          />}
        </div>
        <div>
          <h2>{user?.name}</h2>
          <p className="lead text-muted">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Logout
        </button>
      </div>
      <div className="max-w-5xl w-full items-center justify-between">
        <p className="font-bold">{tokenMetadata?.organizationName}</p>
        </div>
      <div className="max-w-5xl w-full items-center justify-between">
        <p className="lead text-muted">User data: </p>
        <span>{JSON.stringify(user, null, 2)}</span>
      </div>
    </main>
  );
};

export default Profile