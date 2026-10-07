"use client";

import { axiosInstance } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { UserSerializer } from "@/lib/types";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  Search,
  Shield,
  UserIcon,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FilterType = "ALL" | "ADMIN" | "CUSTOMER";
type VerificationFilter = "ALL" | "VERIFIED" | "PENDING";
type SortOption = "name-asc" | "name-desc" | "newest";

type UsersResponse = {
  results?: UserSerializer[];
  next?: string | null;
  previous?: string | null;
  count?: number;
};

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const { token } = useAuthStore();

  const [users, setUsers] = useState<UserSerializer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterType>("ALL");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("ALL");

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAllUsers = async () => {
      try {
        setLoading(true);

        let url: string | null = "/users/";
        let allUsers: UserSerializer[] = [];

        while (url) {
          const response = await axiosInstance.get<
            UsersResponse | UserSerializer[]
          >(url);

          const data = response.data;

          if (Array.isArray(data)) {
            allUsers = [...allUsers, ...data];
            url = null;
            break;
          }

          const pageUsers = Array.isArray(data?.results) ? data.results : [];

          allUsers = [...allUsers, ...pageUsers];

          url = data?.next ?? null;
        }

        if (!cancelled) {
          setUsers(allUsers);
        }
      } catch (error) {
        console.error("Failed to load users", error);

        if (!cancelled) {
          setUsers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllUsers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const username = String(user.username ?? "").toLowerCase();

      const email = String(user.email ?? "").toLowerCase();

      const phone = String(user.profile?.phone_number ?? "").toLowerCase();

      const matchesSearch =
        !query ||
        username.includes(query) ||
        email.includes(query) ||
        phone.includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        (roleFilter === "ADMIN" && user.is_staff) ||
        (roleFilter === "CUSTOMER" && !user.is_staff);

      const isVerified = Boolean(user.profile?.is_verified);

      const matchesVerification =
        verificationFilter === "ALL" ||
        (verificationFilter === "VERIFIED" && isVerified) ||
        (verificationFilter === "PENDING" && !isVerified);

      return matchesSearch && matchesRole && matchesVerification;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return String(b.username ?? "").localeCompare(
            String(a.username ?? ""),
          );

        case "newest":
          return Number(b.id ?? 0) - Number(a.id ?? 0);

        case "name-asc":
        default:
          return String(a.username ?? "").localeCompare(
            String(b.username ?? ""),
          );
      }
    });
  }, [users, searchTerm, roleFilter, verificationFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, verificationFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const adminCount = users.filter((user) => user.is_staff).length;

  const customerCount = users.filter((user) => !user.is_staff).length;

  const verifiedCount = users.filter(
    (user) => user.profile?.is_verified,
  ).length;

  const pendingCount = users.length - verifiedCount;

  if (loading) {
    return <UsersSkeleton />;
  }

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full   ">
            <Users className="h-6 w-6 text-blue-800" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Sign in required
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to manage your store users.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Store management</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            View customers, administrators, and account verification status.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total users"
          value={users.length}
          icon={<Users className="h-5 w-5" />}
          description="Registered accounts"
        />

        <SummaryCard
          label="Customers"
          value={customerCount}
          icon={<UserIcon className="h-5 w-5" />}
          description="Regular customers"
        />

        <SummaryCard
          label="Admins"
          value={adminCount}
          icon={<Shield className="h-5 w-5" />}
          description="Staff accounts"
        />

        <SummaryCard
          label="Verified"
          value={verifiedCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description={`${pendingCount} pending verification`}
        />
      </div>

      {/* Main users section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search / toolbar */}
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search username, email or phone..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100 sm:w-48"
              >
                <option value="name-asc">Name: A to Z</option>

                <option value="name-desc">Name: Z to A</option>

                <option value="newest">Newest users</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-1">
                <FilterButton
                  active={roleFilter === "ALL"}
                  onClick={() => setRoleFilter("ALL")}
                >
                  All users
                  <FilterCount
                    count={users.length}
                    active={roleFilter === "ALL"}
                  />
                </FilterButton>

                <FilterButton
                  active={roleFilter === "CUSTOMER"}
                  onClick={() => setRoleFilter("CUSTOMER")}
                >
                  Customers
                  <FilterCount
                    count={customerCount}
                    active={roleFilter === "CUSTOMER"}
                  />
                </FilterButton>

                <FilterButton
                  active={roleFilter === "ADMIN"}
                  onClick={() => setRoleFilter("ADMIN")}
                >
                  Admins
                  <FilterCount
                    count={adminCount}
                    active={roleFilter === "ADMIN"}
                  />
                </FilterButton>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationFilter("ALL")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    verificationFilter === "ALL"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationFilter("VERIFIED")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    verificationFilter === "VERIFIED"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Verified
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationFilter("PENDING")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    verificationFilter === "PENDING"
                      ? "   bg-amber-500  text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
          <p className="text-sm text-gray-500">
            {filteredUsers.length === 0
              ? "No users found"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredUsers.length,
                )} of ${filteredUsers.length} users`}
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Verification
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {paginatedUsers.map((user) => (
                <MobileUserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyUsers
            hasSearch={Boolean(searchTerm)}
            hasFilter={roleFilter !== "ALL" || verificationFilter !== "ALL"}
            onClear={() => {
              setSearchTerm("");
              setRoleFilter("ALL");
              setVerificationFilter("ALL");
            }}
          />
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: UserSerializer }) {
  const username = user.username || "User";

  return (
    <tr className="group transition hover:bg-gray-50/70">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar username={username} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {username}
            </p>

            <p className="mt-1 text-xs text-gray-400">User ID: {user.id}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-gray-400" />

            <p className="max-w-[240px] truncate text-sm text-gray-700">
              {user.email || "No email"}
            </p>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            {user.profile?.phone_number || "No phone number"}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        {user.is_staff ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-purple-700">
            <Shield className="h-3.5 w-3.5" />
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
            <UserIcon className="h-3.5 w-3.5" />
            Customer
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <VerificationBadge verified={Boolean(user.profile?.is_verified)} />
      </td>
    </tr>
  );
}

function MobileUserCard({ user }: { user: UserSerializer }) {
  const username = user.username || "User";

  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <UserAvatar username={username} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {username}
            </p>

            {user.is_staff ? (
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                Admin
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                Customer
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-sm text-gray-500">
            {user.email || "No email"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {user.profile?.phone_number || "No phone number"}
          </p>
        </div>

        <VerificationBadge verified={Boolean(user.profile?.is_verified)} />
      </div>
    </div>
  );
}

function UserAvatar({ username }: { username: string }) {
  const initial = username.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
      {initial}
    </div>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border  px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-800 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function FilterCount({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
        active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      {count}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg    text-blue-800">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyUsers({
  hasSearch,
  hasFilter,
  onClear,
}: {
  hasSearch: boolean;
  hasFilter: boolean;
  onClear: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Users className="h-6 w-6 text-gray-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {hasSearch || hasFilter ? "No matching users" : "No users found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch || hasFilter
          ? "Try changing your search or filters."
          : "Registered users will appear here."}
      </p>

      {(hasSearch || hasFilter) && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function UsersSkeleton() {
  return (
    <div className="space-y-7">
      <div className="animate-pulse border-b border-gray-200 pb-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-3 h-8 w-36 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-14 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
              </div>

              <div className="h-10 w-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse border-b border-gray-200 p-5">
          <div className="h-11 max-w-lg rounded-lg bg-gray-200" />

          <div className="mt-5 h-9 w-full max-w-lg rounded-lg bg-gray-200" />
        </div>

        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />

                <div>
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-44 rounded bg-gray-200" />
                </div>
              </div>

              <div className="hidden h-7 w-20 rounded-full bg-gray-200 md:block" />

              <div className="hidden h-7 w-20 rounded-full bg-gray-200 md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
