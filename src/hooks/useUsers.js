import { useEffect, useState } from "react";
import { listUsers, updateUser, createUser } from "../services/users.service";

export function useUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const { data } = await listUsers(opts);
      setRows(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (user) => {
    if (!user?.id) {
      // create new user and insert it at the top of the current rows so
      // it's immediately visible on the first page.
      try {
        const created = await createUser(user);
        setRows((prev) => [created, ...prev]);
        return;
      } catch (err) {
        console.error("Failed creating user:", err);
        await load();
        throw err;
      }
    }

    // optimistic update locally for existing user
    setRows((prev) =>
      prev.map((r) => (r.id === user.id ? { ...r, ...user } : r))
    );
    try {
      await updateUser(user.id, user);
      // reload to ensure server truth
      await load();
    } catch (err) {
      console.error("Failed saving user:", err);
      // reload to revert optimistic change
      await load();
      throw err;
    }
  };

  return { rows, loading, reload: load, save };
}
