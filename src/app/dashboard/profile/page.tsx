'use client'

import { UserProfile, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const ProfilePage = () => {
  const { userId } = useAuth();
  if (!userId) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useTheme();

  return (
    <>
      <h2 className="w-full mt-12 text-center text-2xl ">Profile</h2>
      <section className="flex w-full flex-col py-4 mx-2 justify-center items-center">
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
      </section>
      
    </>
  );
};

export default ProfilePage;
