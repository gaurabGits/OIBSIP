import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { getAdminUsers } from "../../services/adminService";

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Could not load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return users;

    return users.filter((user) =>
      [user.fname, user.email, user.phone, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query, users]);

  const verifiedCount = users.filter(
    (user) => user.isEmailVerified
  ).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c1442d]">
            Accounts
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#1c1712]">
            User management
          </h2>

          <p className="mt-2 text-sm text-[#806f60]">
            Review customer accounts and verification status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd2] bg-white px-4 py-2 text-sm font-bold text-[#5c4f42] shadow-sm hover:border-[#c1442d] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total accounts" value={users.length} />
        <Metric label="Verified email" value={verifiedCount} />
        <Metric
          label="Unverified"
          value={users.length - verifiedCount}
          warning
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[#eee5d9] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#f1e9df] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black text-[#1c1712]">All accounts</h3>
            <p className="mt-1 text-xs text-[#806f60]">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          <label className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#806f60]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full rounded-lg border border-[#eadfd2] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#c1442d] focus:ring-2 focus:ring-[#c1442d]/15"
            />
          </label>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-[#faf6ef]"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#806f60]">
            No users match your search.
          </p>
        ) : (
          <div className="divide-y divide-[#f1e9df]">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff0df] text-[#c1442d]">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#1c1712]">
                      {user.fname}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#806f60]">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#faf6ef] px-2.5 py-1.5 text-[#5c4f42]">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phone}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#faf6ef] px-2.5 py-1.5 capitalize text-[#5c4f42]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user.role}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ${
                      user.isEmailVerified
                        ? "bg-[#e6f4ea] text-[#1e7e34]"
                        : "bg-[#fce8e6] text-[#c5221f]"
                    }`}
                  >
                    {user.isEmailVerified ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>

                  <span className="text-[#806f60]">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value, warning = false }) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-[#806f60]">{label}</p>
      <p
        className={`mt-1 text-2xl font-black ${
          warning && value > 0 ? "text-[#c1442d]" : "text-[#1c1712]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default UserManagementPage;