import { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [retry, setRetry] = useState(0);

  const {
    data: users,
    loading,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/users?retry=${retry}`);

  const searchValue = useDebounce(search, 400);

  const filteredUsers = users
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.trim().toLowerCase()),
      )
    : [];

  const usersPerPage = 4;

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const startIndex = (currentPage - 1) * usersPerPage;

  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">User Directory</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        maxLength={30}
        onChange={(e) => setSearch(e.target.value.slice(0, 30))}
        className="mb-6 w-full rounded-lg border p-3"
      />

      {loading && <p>Loading users...</p>}

      {error && (
        <div>
          <p className="text-red-500">Failed to load users.</p>

          <button
            onClick={() => setRetry((value) => value + 1)}
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Company</th>
                <th className="p-4">City</th>
              </tr>
            </thead>

            <tbody>
              {displayedUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="cursor-pointer border-t hover:bg-gray-100"
                >
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.company.name}</td>
                  <td className="p-4">{user.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="p-6 text-center">No users match your search</p>
          )}
        </div>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(page - 1)}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`rounded px-3 py-2 ${
                  currentPage === number
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            ),
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

function UserDetails({ user, onClose }) {
  const {
    data: posts,
    loading,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(user.email);

  return (
    <div className="fixed inset-0 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6">
        <button
          onClick={onClose}
          className="mb-5 rounded bg-gray-200 px-4 py-2"
        >
          Close
        </button>

        <h2 className="mb-4 text-2xl font-bold">{user.name}</h2>

        <p>Username: {user.username}</p>

        <p>Email: {user.email}</p>

        {!validEmail && (
          <span className="rounded bg-red-100 px-2 py-1 text-red-600">
            Invalid email
          </span>
        )}

        <p>Phone: {user.phone}</p>

        <p>Website: {user.website}</p>

        <p>
          Address: {user.address.street},{user.address.city}
        </p>

        <p>Company: {user.company.name}</p>

        <h3 className="mb-3 mt-6 text-xl font-bold">User Posts</h3>

        {loading && <p>Loading posts...</p>}

        {error && <p className="text-red-500">Could not load posts</p>}

        {posts &&
          posts.map((post) => (
            <div key={post.id} className="mb-3 rounded border p-3">
              <h4 className="font-bold">{post.title}</h4>

              <p className="mt-2 text-sm text-gray-600">{post.body}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
