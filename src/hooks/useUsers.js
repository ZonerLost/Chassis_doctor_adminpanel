/*
 * Custom hook that encapsulates users state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../services/users.service";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_NEW_USER_ROLE = "parent";

export function useUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTermState] = useState("");
  const [statusFilter, setStatusFilterState] = useState("");
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize, total]
  );

  /*
   * Centralized loader so pagination, filters, and explicit reload actions
   * share the same request path and state transition behavior.
   */
  const load = useCallback(
    async (overrides = {}) => {
      const params = {
        page,
        pageSize,
        query: searchTerm,
        status: statusFilter,
        ...overrides,
      };

      setLoading(true);

      try {
        const { data, total: nextTotal } = await listUsers(params);
        setRows(data || []);
        setTotal(nextTotal || 0);
        return { data, total: nextTotal || 0 };
      } catch (error) {
        console.error("Failed to load users:", error);
        setRows([]);
        setTotal(0);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchTerm, statusFilter]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  // Clamp current page if filters shrink the result set.
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const setSearchTerm = (value) => {
    setPage(1);
    setSearchTermState(value);
  };

  const setStatusFilter = (value) => {
    setPage(1);
    setStatusFilterState(value);
  };

  const setPageSize = (value) => {
    setPage(1);
    setPageSizeState(Number(value) || DEFAULT_PAGE_SIZE);
  };

  // Create and update follow different back-end paths, but expose one UI action.
  const save = async (user) => {
    if (!user?.id) {
      await createUser({
        ...user,
        role: user?.role || DEFAULT_NEW_USER_ROLE,
      });
      if (page !== 1) {
        setPage(1);
      }
      await load({ page: 1 });
      return;
    }

    await updateUser(user.id, user);
    await load();
  };

  const remove = async (userId) => {
    await deleteUser(userId);

    const shouldGoBack = rows.length === 1 && page > 1;
    const nextPage = shouldGoBack ? page - 1 : page;

    if (shouldGoBack) {
      setPage(nextPage);
    }

    await load({ page: nextPage });
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = total === 0 ? 0 : Math.min(page * pageSize, total);

  return {
    rows,
    loading,
    total,
    page,
    pageSize,
    totalPages,
    searchTerm,
    statusFilter,
    showingFrom,
    showingTo,
    setPage,
    setPageSize,
    setSearchTerm,
    setStatusFilter,
    reload: load,
    save,
    remove,
  };
}
