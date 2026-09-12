import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft,  FaTrash, FaUsers,FaHome,FaStore,FaUserTie, FaFileAlt, FaSearch, FaBell, FaEye, FaEllipsisH,} from "react-icons/fa";
import {AreaChart, Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer, PieChart,Pie,Cell,} from "recharts";
import "../styles/adminDashboard.css";
import { getAdminDashboardStats, getAllListings, getAllUsers,getUserById, deleteUser, approveListing, rejectListing,deleteListing,getAllRequests, approveRequest,rejectRequest,} from "../services/adminService";
import Swal from 'sweetalert2';

const showAlert = () => {
  Swal.fire({
    title: 'Success!',
    text: 'Your message has been sent successfully via WhatsApp!',
    icon: 'success',
    confirmButtonText: 'OK',
    color: '#c9a24b',
    confirmButtonColor: '#c9a24b'
  });
};
const CANDIDATE_KEYS = ["data", "listings", "users", "results", "items"];
function unwrapArray(res) {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  for (const key of CANDIDATE_KEYS) {
    const value = res[key];
    if (Array.isArray(value)) return value;

    if (value && typeof value === "object") {
      for (const nestedKey of CANDIDATE_KEYS) {
        if (Array.isArray(value[nestedKey])) return value[nestedKey];
      }
    }
  }

  return [];
}

function unwrapObject(res) {
  if (!res || typeof res !== "object") return res;
  if (res.data && typeof res.data === "object") {
    if (res.data.data && typeof res.data.data === "object") {
      return res.data.data;
    }
    return res.data;
  }
  return res;
}
function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingsSearch, setListingsSearch] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllListings, setShowAllListings] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [openRequestMenuId, setOpenRequestMenuId] = useState(null);

  async function loadRequests() {
    try {
      setRequestsLoading(true);
      const res = await getAllRequests();
      const arr = unwrapArray(res);
      setRequests(arr);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  }

  async function handleApproveRequest(id) {
    try {
      await approveRequest(id);
      setOpenRequestMenuId(null);
      await loadRequests();
    } catch (err) {
      showAlertalert(err.message || "Couldn't approve this request.");
    }
  }

  async function handleRejectRequest(id) {
    const rejectionReason = window.prompt("Why are you rejecting this request?");
    if (rejectionReason === null) return;
    try {
      await rejectRequest(id, rejectionReason || "No reason provided");
      setOpenRequestMenuId(null);
      await loadRequests();
    } catch (err) {
      showAlertalert(err.message || "Couldn't reject this request.");
    }
  }

  async function handleViewUser(id) {
    try {
      setUserDetailsLoading(true);
      const data = await getUserById(id);
      setSelectedUser(unwrapObject(data));
    } catch (err) {
      showalert(err.message || "Couldn't load this user's details.");
    } finally {
      setUserDetailsLoading(false);
    }
  }

  async function handleDeleteUser(u) {
    const id = u._id || u.id;
    const name = u.fullName || u.name || "this user";
    if (!window.confirm(`Delete ${name}? This can't be undone.`)) return;
    try {
      setDeletingUserId(id);
      await deleteUser(id);
      const refreshed = await getAllUsers({ limit: 20 });
      setUsers(unwrapArray(refreshed));
    } catch (err) {
      showAlertalert(err.message || "Couldn't delete this user. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleDeleteListing(id) {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      setActionError("");
      await deleteListing(id);
      await loadListings();
    } catch (err) {
      console.error("Delete listing failed:", err);
      setActionError("Couldn't delete this listing. Please try again.");
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadStatsAndUsers() {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, usersRes] = await Promise.all([
          getAdminDashboardStats(),
          getAllUsers({ limit: 20 }),
        ]);

        if (!isMounted) return;
        setStats(unwrapObject(statsRes));
        setUsers(unwrapArray(usersRes));
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
        if (isMounted) setError("Couldn't load dashboard data. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStatsAndUsers();
    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  async function loadListings() {
    try {
      setListingsLoading(true);
      const filters = listingsSearch ? { limit: 20, search: listingsSearch } : { limit: 20 };
      const listingsRes = await getAllListings(filters);
      const arr = unwrapArray(listingsRes);
      setListings(arr);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setListingsLoading(false);
    }
  }

  useEffect(() => {
    const debounce = setTimeout(loadListings, listingsSearch ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [listingsSearch]);

  async function handleApprove(id) {
    try {
      setActionError("");
      await approveListing(id);
      setOpenMenuId(null);
      await loadListings();
    } catch (err) {
      console.error("Approve failed:", err);
      setActionError("Couldn't approve this listing. Please try again.");
    }
  }

  async function handleReject(id) {
    const reason = window.prompt("Why are you rejecting this listing?");
    if (reason === null) return; 

    try {
      setActionError("");
      await rejectListing(id, reason || "No reason provided");
      setOpenMenuId(null);
      await loadListings();
    } catch (err) {
      console.error("Reject failed:", err);
      setActionError("Couldn't reject this listing. Please try again.");
    }
  }

  const totalUsersCount = stats?.totalUsers ?? (Array.isArray(users) ? users.length : 0);
  const sellersCount = stats?.totalSellers ?? (Array.isArray(users) ? users.filter(u => u.role === "seller").length : 0);
  const buyersCount = stats?.buyers ?? Math.max(0, totalUsersCount - sellersCount);

  const growthData = [
    { month: "Start", users: Math.floor(totalUsersCount * 0.6), sellers: Math.floor(sellersCount * 0.5), buyers: Math.floor(buyersCount * 0.5) },
    { month: "Mid", users: Math.floor(totalUsersCount * 0.8), sellers: Math.floor(sellersCount * 0.8), buyers: Math.floor(buyersCount * 0.8) },
    { month: "Current", users: totalUsersCount, sellers: sellersCount, buyers: buyersCount },
  ];

  const listingsArray = Array.isArray(listings) ? listings : [];
  const forSaleCount = listingsArray.filter(item => item.type === "For Sale" || item.status === "approved").length;
  const soldCount = listingsArray.filter(item => item.status === "sold").length;
  const pendingCount = listingsArray.filter(item => item.status === "pending").length;
  const totalListingsCount = stats?.totalListings ?? listingsArray.length;

  const propertyStatusData = [
    { name: "For Sale", value: forSaleCount, color: "#f5b301" },
    { name: "Sold", value: soldCount, color: "#3a86ff" },
    { name: "Pending", value: pendingCount, color: "#f77f00" },
  ];

  const statCards = [
    { icon: <FaUsers />, label: "Total Users", value: totalUsersCount, tone: "gold" },
    { icon: <FaHome />, label: "Total Properties", value: totalListingsCount, tone: "blue" },
    { icon: <FaStore />, label: "Sellers", value: sellersCount, tone: "green" },
    { icon: <FaUserTie />, label: "Buyers", value: buyersCount, tone: "red" },
    { icon: <FaFileAlt />, label: "Pending Requests", value: stats?.pendingListings ?? stats?.pendingRequests ?? stats?.pending ?? 0, tone: "purple" },
    { icon: <FaEye />, label: "Total Views", value: stats?.totalViews ?? stats?.views ?? 0, tone: "blue" },
    { icon: <FaHome />, label: "Total Favorites", value: stats?.totalFavorites ?? stats?.favorites ?? 0, tone: "gold" },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="main-content full-width">
          <p style={{ padding: 24, color: "#9b9b9b" }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="main-content full-width">
          <p style={{ padding: 24, color: "#f26d6d" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="main-content full-width">
        <div className="dashboard-top-row">
          <Link to="/" className="back-to-home">
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>

          <div className="topbar-right">
            <button className="icon-btn" aria-label="Notifications">
              <FaBell />
            </button>
            <div className="admin-pill">
              <span className="admin-avatar">AD</span>
              <span>Admin</span>
            </div>
          </div>
        </div>

        <div className="welcome-row">
          <div>
            <h1>Welcome, Admin 👋</h1>
            <p>Here's what's happening with your real estate platform today.</p>
          </div>
          <span className="welcome-date">
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        <div className="stats-grid">
          {statCards.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon tone-${s.tone}`}>{s.icon}</div>
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-row">
         <div className="chart-card growth-card" style={{ minHeight: "260px" }}>
            <div className="card-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <h2 style={{ margin: 0 }}>Users Growth (Sellers vs Buyers)</h2>
            </div>
            
            <div style={{ width: "100%", height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="sellersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3a3a3a" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3a3a3a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="buyersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5b301" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f5b301" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#2b2b2b" vertical={false} />
                  <XAxis dataKey="month" stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9b9b9b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2b2b2b", borderRadius: 8 }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="sellers" name="Sellers" stroke="#3a3a3a" strokeWidth={2} fill="url(#sellersFill)" />
                  <Area type="monotone" dataKey="buyers" name="Buyers" stroke="#f5b301" strokeWidth={2} fill="url(#buyersFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

         <div className="chart-card roles-card">
            <h2>Property Status</h2>
            <div className="donut-wrapper">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {propertyStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <strong>{totalListingsCount}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="roles-legend">
              {propertyStatusData.map((item) => (
                <div className="roles-legend-item" key={item.name}>
                  <span>
                    <i className="dot" style={{ backgroundColor: item.color }} /> {item.name}
                  </span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card recent-users-card">
            <div className="card-header-row">
              <h2>Recent Users</h2>
              <button
                type="button"
                className="view-all-link"
                style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
                onClick={() => setShowAllUsers((v) => !v)}
              >
                {showAllUsers ? "Show Less" : "View All"} →
              </button>
            </div>
            <ul
              className="recent-users-list"
              style={
                showAllUsers
                  ? { maxHeight: 260, overflowY: "auto" }
                  : undefined
              }
            >
              {(showAllUsers ? users : (Array.isArray(users) ? users : []).slice(0, 5)).map((u) => (
                <li key={u._id || u.id || u.fullName}>
                  <span className="avatar">
                    {(u.fullName || u.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span
                    className="user-name user-name-clickable"
                    onClick={() => handleViewUser(u._id || u.id)}
                  >
                    {u.fullName || u.name}
                  </span>
                  <span className={`role-tag role-${(u.role || u.userRole || "").toLowerCase()}`}>{u.role || u.userRole}</span>
                  <button
                    className="icon-action delete-user-btn"
                    aria-label="Delete user"
                    disabled={deletingUserId === (u._id || u.id)}
                    onClick={() => handleDeleteUser(u)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
              {users.length === 0 && <li style={{ color: "#9b9b9b", fontSize: 12 }}>No users yet.</li>}
            </ul>
          </div>
        </div>
            
        <div className="listings-card">
          <div className="card-header-row">
            <h2>Seller Verification Requests</h2>
          </div>

          <ul className="recent-users-list">
            {requestsLoading && <li style={{ color: "#9b9b9b", fontSize: 12 }}>Loading…</li>}
            {!requestsLoading && requests.length === 0 && (
              <li style={{ color: "#9b9b9b", fontSize: 12 }}>No requests yet.</li>
            )}
            {requests.map((r) => (
              <li key={r._id || r.id} style={{ position: "relative" }}>
                <span className="user-name">
                  {r.fullName || r.user?.fullName || `Request #${(r._id || r.id || "").toString().slice(-6)}`}
                </span>
                <span className={`status-tag ${r.status === "approved" ? "status-active" : r.status === "rejected" ? "status-rejected" : "status-pending"}`}>
                  {r.status}
                </span>

                <button
                  className="icon-action"
                  aria-label="More"
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    setOpenRequestMenuId((current) => (current === (r._id || r.id) ? null : r._id || r.id))
                  }
                >
                  <FaEllipsisH />
                </button>

                {openRequestMenuId === (r._id || r.id) && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "#1a1a1a", border: "1px solid #2b2b2b", borderRadius: 8, zIndex: 10, minWidth: 120 }}>
                    {r.status !== "approved" && (
                      <button onClick={() => handleApproveRequest(r._id || r.id)} style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#35c17a", fontSize: 12, textAlign: "left", cursor: "pointer" }}>
                        Approve
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button onClick={() => handleRejectRequest(r._id || r.id)} style={{ display: "block", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#f26d6d", fontSize: 12, textAlign: "left", cursor: "pointer" }}>
                        Reject
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="listings-card">
          <div className="card-header-row">
            <h2>Recent Property Listings</h2>

            <div className="search-box listings-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search properties..."
                value={listingsSearch}
                onChange={(e) => setListingsSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="view-all-link"
              style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
              onClick={() => setShowAllListings((v) => !v)}
            >
              {showAllListings ? "Show Less" : "View All"} →
            </button>
          </div>

          {actionError && (
            <p style={{ color: "#f26d6d", fontSize: 12, marginBottom: 10 }}>{actionError}</p>
          )}

          <div
            className="listings-table-wrapper"
            style={
              showAllListings
                ? { maxHeight: 360, overflowY: "auto" }
                : undefined
            }
          >
            <table className="listings-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAllListings ? listings : (Array.isArray(listings) ? listings : []).slice(0, 4)).map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <img src={item.image} alt={item.title} className="listing-thumb" />
                    </td>
                    <td>{item.title}</td>
                    <td>
                      {typeof item.location === "string"
                        ? item.location
                        : item.location?.address || item.location?.city || "—"}
                    </td>
                    <td>
                      <span className={`type-tag ${item.type === "For Sale" ? "type-sale" : "type-rent"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.price}</td>
                    <td>
                      <span
                        className={`status-tag ${
                          item.status === "approved"
                            ? "status-active"
                            : item.status === "rejected"
                            ? "status-rejected"
                            : "status-pending"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="actions-cell" style={{ position: "relative", display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        className="icon-action"
                        aria-label="View"
                        onClick={() => navigate(`../pages/propertyDetails/PropertyDetails.jsx${item._id || item.id}`)}>
                        <FaEye />
                      </button>

                      <button
                        className="icon-action delete-listing-btn"
                        aria-label="Delete listing"
                        onClick={() => handleDeleteListing(item._id || item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#f26d6d", display: "flex", alignItems: "center" }}>
                        <FaTrash />
                      </button>

                      <button
                        className="icon-action"
                        aria-label="More"
                        onClick={() =>
                          setOpenMenuId((current) => (current === (item._id || item.id) ? null : item._id || item.id))
                        }
                      >
                        <FaEllipsisH />
                      </button>

                      {openMenuId === (item._id || item.id) && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            background: "#1a1a1a",
                            border: "1px solid #2b2b2b",
                            borderRadius: 8,
                            zIndex: 10,
                            minWidth: 120,
                            overflow: "hidden",
                          }}
                        >
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(item._id || item.id)}
                              style={{
                                display: "block",
                                width: "100%",
                                padding: "8px 12px",
                                background: "none",
                                border: "none",
                                color: "#35c17a",
                                fontSize: 12,
                                textAlign: "left",
                                cursor: "pointer",
                              }}
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== "rejected" && (
                            <button
                              onClick={() => handleReject(item._id || item.id)}
                              style={{
                                display: "block",
                                width: "100%",
                                padding: "8px 12px",
                                background: "none",
                                border: "none",
                                color: "#f26d6d",
                                fontSize: 12,
                                textAlign: "left",
                                cursor: "pointer",
                              }}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ color: "#9b9b9b", fontSize: 12, padding: 16 }}>
                      No listings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {(selectedUser || userDetailsLoading) && (
          <div className="user-modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <button className="user-modal-close" onClick={() => setSelectedUser(null)}>✕</button>
              {userDetailsLoading ? (
                <p>Loading…</p>
              ) : (
                selectedUser && (
                  <>
                    <h2>{selectedUser.fullName || selectedUser.name}</h2>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Role:</strong> {selectedUser.role || selectedUser.userRole}</p>
                    {selectedUser.phoneNumber && (
                      <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        )}

        <footer className="footer-bottom">
          NOVA | Find Your Dream Home
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;