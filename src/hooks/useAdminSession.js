/*
 * Custom hook that encapsulates admin session state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useEffect, useState } from "react";
import {
  bootstrapAdminSession,
  onAuthStateChange,
} from "../services/auth.service";

export default function useAdminSession() {
  const [state, setState] = useState({
    loading: true,
    admin: null,
  });

  useEffect(() => {
    let active = true;

    // Rehydrate the session on mount and on every auth state transition.
    const syncSession = async () => {
      try {
        const admin = await bootstrapAdminSession();
        if (!active) return;
        setState({
          loading: false,
          admin,
        });
      } catch {
        if (!active) return;
        setState({
          loading: false,
          admin: null,
        });
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = onAuthStateChange(() => {
      syncSession();
    });

    return () => {
      active = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  return state;
}
