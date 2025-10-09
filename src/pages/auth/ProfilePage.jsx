import { ReactUserProfile } from "@neuctra/authix";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ReactUserProfile />
    </div>
  );
};

export default ProfilePage;
