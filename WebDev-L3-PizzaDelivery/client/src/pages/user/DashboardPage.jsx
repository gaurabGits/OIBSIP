import { Mail, Phone, Shield, UserCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const displayName = user?.fname || user?.name || "User";

  return (
    <section className="min-h-svh bg-[#FAF6EF] px-4 pb-10 pt-[104px] sm:px-6 sm:pt-[112px]">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-[#F0E2D0] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#F0E2D0] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#E8641F]/10 text-[#C1442D]">
                <UserCircle className="h-8 w-8" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold text-[#1a1a1a] sm:text-3xl">
                  Welcome, {displayName}!
                </h1>
                <p className="mt-1 text-sm font-medium text-[#6b5c4d]">
                  You are successfully logged in.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-full bg-[#C1442D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#9c3320] sm:w-auto"
            >
              Logout
            </button>
          </div>

          <div className="pt-6">
            <h2 className="text-lg font-bold text-[#1a1a1a]">User Information</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAF6EF] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9a6a35]">ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-[#1a1a1a]">{user?.id || "-"}</p>
              </div>

              <div className="rounded-xl bg-[#FAF6EF] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9a6a35]">Name</p>
                <p className="mt-1 text-sm font-semibold text-[#1a1a1a]">{displayName}</p>
              </div>

              <div className="rounded-xl bg-[#FAF6EF] p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a6a35]">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1a1a1a]">{user?.phone || "-"}</p>
              </div>

              <div className="rounded-xl bg-[#FAF6EF] p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a6a35]">
                  <Mail className="h-3.5 w-3.5" /> Email
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-[#1a1a1a]">{user?.email || "-"}</p>
              </div>

              <div className="rounded-xl bg-[#FAF6EF] p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a6a35]">
                  <Shield className="h-3.5 w-3.5" /> Role
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-[#1a1a1a]">{user?.role || "user"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;