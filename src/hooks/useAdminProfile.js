import { useEffect, useState } from "react";
import { getCurrentAdminProfile } from "../services/settings.service";
import {
  ADMIN_PROFILE_UPDATED_EVENT,
  AUTH_PROFILE_STORAGE_KEY,
  getStoredAdmin,
} from "../utils/auth";

const EMPTY_PROFILE = {
  id: "",
  fullName: "",
  email: "",
  avatarUrl: "",
  role: "",
  status: "",
};

let profileRequest = null;

function readCachedAdminProfile() {
  return getStoredAdmin() || EMPTY_PROFILE;
}

function fetchAdminProfileOnce() {
  if (!profileRequest) {
    profileRequest = getCurrentAdminProfile().finally(() => {
      profileRequest = null;
    });
  }

  return profileRequest;
}

export default function useAdminProfile() {
  const [profile, setProfile] = useState(readCachedAdminProfile);
  const [loading, setLoading] = useState(() => !readCachedAdminProfile()?.id);

  useEffect(() => {
    let active = true;

    const syncFromCache = (nextProfile) => {
      if (!active) return;
      setProfile(nextProfile || readCachedAdminProfile());
      setLoading(false);
    };

    fetchAdminProfileOnce()
      .then((nextProfile) => {
        if (!active || !nextProfile) return;
        setProfile((prev) => ({
          ...prev,
          ...nextProfile,
        }));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    const handleProfileUpdate = (event) => {
      syncFromCache(event?.detail || null);
    };

    const handleStorage = (event) => {
      if (event.key && event.key !== AUTH_PROFILE_STORAGE_KEY) return;
      syncFromCache();
    };

    window.addEventListener(ADMIN_PROFILE_UPDATED_EVENT, handleProfileUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      active = false;
      window.removeEventListener(
        ADMIN_PROFILE_UPDATED_EVENT,
        handleProfileUpdate
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    profile,
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    avatarUrl: profile?.avatarUrl || "",
    loading,
  };
}
