'use client'

import { UserProfile, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const ProfilePage = () => {
  const { userId } = useAuth();
  if (!userId) return null;
  const { theme } = useTheme();

  return (
    <>
      <h2 className="py-4 text-3xl ">Profile</h2>
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </>
  );
};

export default ProfilePage;
