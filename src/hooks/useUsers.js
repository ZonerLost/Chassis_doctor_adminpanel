import { useState } from "react";
import { users } from "../Data/users.fixtures";

export function useUsers() {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    role: "",
    status: "",
    search: "",
  });

  const [loading, setLoading] = useState(false);

  // Mock data filtering
  const filteredUsers = users.filter((user) => {
    if (
      state.search &&
      !user.name.toLowerCase().includes(state.search.toLowerCase())
    ) {
      return false;
    }
    if (state.role && user.role !== state.role) {
      return false;
    }
    if (state.status && user.status !== state.status) {
      return false;
    }
    return true;
  });

  const total = filteredUsers.length;
  const rows = filteredUsers.slice(
    (state.page - 1) * state.limit,
    state.page * state.limit
  );

  const setPage = (page) => setState((prev) => ({ ...prev, page }));
  const setRole = (role) => setState((prev) => ({ ...prev, role, page: 1 }));
  const setStatus = (status) =>
    setState((prev) => ({ ...prev, status, page: 1 }));
  const setSearch = (search) =>
    setState((prev) => ({ ...prev, search, page: 1 }));

  const toggleSuspend = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => setLoading(false), 500);
  };

  const promote = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => setLoading(false), 500);
  };

  return {
    state,
    rows,
    total,
    loading,
    search: state.search,
    setPage,
    setRole,
    setStatus,
    setSearch,
    toggleSuspend,
    promote,
  };
}
