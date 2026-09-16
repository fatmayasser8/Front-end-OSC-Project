import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaUsers, FaHome, FaStore, FaUserTie, FaFileAlt, FaSearch, FaEye, FaEllipsisH } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "../styles/adminDashboard.css";
import { 
  getAdminDashboardStats, 
  getAllListings, 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  approveListing, 
  rejectListing, 
  deleteListing, 
  getAllRequests, 
  approveRequest, 
  rejectRequest 
} from "../services/adminService";
import Swal from 'sweetalert2';
import villa1 from "../assets/hero.png";

const showAlert = (message, type = "success") => {
  Swal.fire({
    title: type === "success" ? "Success!" : "Error!",
    text: message,
    icon: type,
    confirmButtonText: "OK",
    color: "#c9a24b",
    confirmButtonColor: "#c9a24b",
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

function unwrapPage(res) {
  const container = res && typeof res === "object" && res.data && typeof res.data === "object"
    ? res.data
    : res;

  if (container && typeof container === "object" && Array.isArray(container.data)) {
    return {
      items: container.data,
      totalPages: Number(container.totalPages) || 1,
      page: Number(container.page) || 1,
    };
  }

  return { items: unwrapArray(res), totalPages: 1, page: 1 };
}

const MAX_PAGES_SAFETY = 30; 
async function fetchAllPages(fetchFn, baseFilters = {}) {
  let page = 1;
  let totalPages = 1;
  let allItems = [];

  do {
    const res = await fetchFn({ ...baseFilters, limit: 50, page });
    const { items, totalPages: tp } = unwrapPage(res);
    allItems = allItems.concat(items);
    totalPages = tp;
    page += 1;
  } while (page <= totalPages && page <= MAX_PAGES_SAFETY);

  return allItems;
}

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/auth/login");
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
  const [modalError, setModalError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [openRequestMenuId, setOpenRequestMenuId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectModal, setRejectModal] = useState({
    open: false,
    id: null,
    type: null,
  });

  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    type: null,
  });
  const [deleting, setDeleting] = useState(false);

  async function loadRequests() {
    try {
      setRequestsLoading(true);
      const res = await getAllRequests();
      const arr = unwrapArray(res);
      setRequests(arr);
    } catch (err) {
      
    } finally {
      setRequestsLoading(false);
    }
  }

  async function handleApproveRequest(id) {
    try {
      await approveRequest(id);
      setOpenRequestMenuId(null);
      
      // تحديث الحالة فوراً في الـ State
      setRequests((prev) =>
        prev.map((r) => ((r._id || r.id) === id ? { ...r, status: "approved" } : r))
      );
      
      await loadRequests();
      showAlert("Request approved successfully!");
    } catch (err) {
      showAlert(err.response?.data?.message || err.message || "Couldn't approve this request.", "error");
    }
  }

  function handleRejectRequest(id) {
    setOpenRequestMenuId(null);
    setRejectionReason("");
    setActionError("");
    setModalError("");
    setRejectModal({
      open: true,
      id,
      type: "request",
    });
  }

  const reasonLength = rejectionReason.trim().length;
  const isReasonValid = reasonLength >= 2;

  // *** التعديل الجوهري هنا للتحديث الفوري لـ Rejection ***
  async function confirmReject() {
    if (!isReasonValid || !rejectModal.id) {
      setModalError("Please enter a valid rejection reason (at least 2 characters).");
      return;
    }

    try {
      setRejecting(true);
      setModalError("");

      if (rejectModal.type === "request") {
        await rejectRequest(rejectModal.id, rejectionReason.trim());

        // 1. تحديث الـ State للـ Requests فوراً
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            (req._id || req.id) === rejectModal.id
              ? { ...req, status: "rejected" }
              : req
          )
        );

        loadRequests(); // إعادة الجلب من السيرفر كإجراء تأكيدي

      } else if (rejectModal.type === "listing") {
        await rejectListing(rejectModal.id, rejectionReason.trim());

        // 2. تحديث الـ State للـ Listings فوراً بدون reload
        setListings((prevListings) =>
          prevListings.map((item) =>
            (item._id || item.id) === rejectModal.id
              ? { ...item, status: "rejected" }
              : item
          )
        );

        loadListings(); // إعادة الجلب من السيرفر كإجراء تأكيدي
      }

      // إغلاق المودال وتصفير القيم
      setRejectModal({
        open: false,
        id: null,
        type: null,
      });
      setRejectionReason("");
      showAlert("Item rejected successfully.");

    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || err.message || "Couldn't reject this item. Please try again.";
      setModalError(apiErrorMessage);
    } finally {
      setRejecting(false);
    }
  }

  async function handleViewUser(id) {
    try {
      setUserDetailsLoading(true);
      const data = await getUserById(id);
      setSelectedUser(unwrapObject(data));
    } catch (err) {
      showAlert(err.response?.data?.message || err.message || "Couldn't load this user's details.", "error");
    } finally {
      setUserDetailsLoading(false);
    }
  }

  function handleDeleteUser(u) {
    const id = u._id || u.id;
    setDeleteModal({
      open: true,
      id,
      type: "user",
    });
  }

  function handleDeleteListing(id) {
    setDeleteModal({
      open: true,
      id,
      type: "listing",
    });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;

    try {
      setDeleting(true);
      setModalError("");

      if (deleteModal.type === "listing") {
        await deleteListing(deleteModal.id);
        
        // حذف من الـ State فوراً
        setListings((prev) => prev.filter((item) => (item._id || item.id) !== deleteModal.id));
        loadListings();
      }

      if (deleteModal.type === "user") {
        await deleteUser(deleteModal.id);
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== deleteModal.id));
        const refreshedUsers = await fetchAllPages(getAllUsers);
        setUsers(refreshedUsers);
      }

      setDeleteModal({
        open: false,
        id: null,
        type: null,
      });
      showAlert("Item deleted successfully.");
    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || err.message || "Couldn't delete this item. Please try again.";
      setModalError(apiErrorMessage);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadStatsAndUsers() {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, allUsers] = await Promise.all([
          getAdminDashboardStats(),
          fetchAllPages(getAllUsers),
        ]);
        if (!isMounted) return;
        setStats(unwrapObject(statsRes));
        setUsers(allUsers);
      } catch (err) {
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
      const baseFilters = listingsSearch ? { search: listingsSearch } : {};
      const allListings = await fetchAllPages(getAllListings, baseFilters);
      setListings(allListings);
    } catch (err) {
      
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
      
      // تحديث الحالة فوراً للـ Listing
      setListings((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, status: "approved" } : item))
      );
      
      await loadListings();
      showAlert("Listing approved successfully!");
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || "Couldn't approve this listing. Please try again.");
    }
  }

  function handleReject(id) {
    setOpenMenuId(null);
    setRejectionReason("");
    setActionError("");
    setModalError("");
    setRejectModal({
      open: true,
      id,
      type: "listing",
    });
  }

  const totalUsersCount = stats?.totalUsers ?? (Array.isArray(users) ? users.length : 0);
  const sellersCount = stats?.totalSellers ?? (Array.isArray(users) ? users.filter(u => u.role === "seller").length : 0);
  const buyersCount = stats?.buyers ?? Math.max(0, totalUsersCount - sellersCount);
  const pendingRequestsCount = requests.filter((request) => request.status === "pending").length;
  const growthData = [
    { month: "Start", users: Math.floor(totalUsersCount * 0.6), sellers: Math.floor(sellersCount * 0.5), buyers: Math.floor(buyersCount * 0.5) },
    { month: "Mid", users: Math.floor(totalUsersCount * 0.8), sellers: Math.floor(sellersCount * 0.8), buyers: Math.floor(buyersCount * 0.8) },
    { month: "Current", users: totalUsersCount, sellers: sellersCount, buyers: buyersCount },
  ];

  const listingsArray = Array.isArray(listings) ? listings : [];
  const totalListingsCount = stats?.totalListings ?? listingsArray.length;

  const forSaleCount = listingsArray.filter(item => item.listingType === "sale" && item.isAvailable === true).length;
  const forRentCount = listingsArray.filter(item => item.listingType === "rent" && item.isAvailable === true).length;
  const propertyStatusData = [
    { name: "For Sale", value: forSaleCount, color: "#f5b301" },
    { name: "For Rent", value: forRentCount, color: "#6c5ce7" },
  ];

  const statCards = [
    { icon: <FaUsers />, label: "Total Users", value: totalUsersCount, tone: "gold" },
    { icon: <FaHome />, label: "Total Properties", value: totalListingsCount, tone: "blue" },
    { icon: <FaStore />, label: "Sellers", value: sellersCount, tone: "green" },
    { icon: <FaUserTie />, label: "Buyers", value: buyersCount, tone: "red" },
    { icon: <FaFileAlt />, label: "Pending Requests", value: pendingRequestsCount, tone: "purple" },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="admin-loading-logo">
            <FaHome />
          </div>
          <h2>NOVA ESTATES</h2>
          <div className="admin-spinner"></div>
          <p>Loading your dashboard...</p>
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
          <button
            type="button"
            className="back-to-home"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>

          <div className="topbar-right">
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

        {/* SELLER VERIFICATION REQUESTS */}
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
              <li key={r._id || r.id} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="user-name">
                  {r.fullName || r.user?.fullName || r.name || `Request #${(r._id || r.id || "").toString().slice(-6)}`}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className={`status-tag ${r.status === "approved" ? "status-active" : r.status === "rejected" ? "status-rejected" : "status-pending"}`}>
                    {r.status}
                  </span>

                  <button
                    className="icon-action"
                    aria-label="View request details"
                    title="View request details"
                    onClick={() => setSelectedRequest(r)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className="icon-action"
                    aria-label="More"
                    onClick={() =>
                      setOpenRequestMenuId((current) => (current === (r._id || r.id) ? null : r._id || r.id))
                    }
                  >
                    <FaEllipsisH />
                  </button>
                </div>

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

        {/* RECENT PROPERTY LISTINGS */}
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
                      <img
                        className="property-table-image"
                        src={item.images?.[0] || villa1}
                        alt={item.title || "Property"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = villa1;
                        }}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>
                      {typeof item.location === "string"
                        ? item.location
                        : item.location?.address || item.location?.city || "—"}
                    </td>
                    <td>
                      <span
                        className={`type-tag ${
                          item.listingType === "sale" ? "type-sale" : "type-rent"
                        }`}
                      >
                        {item.listingType === "sale"
                          ? "For Sale"
                          : item.listingType === "rent"
                          ? "For Rent"
                          : "—"}
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
                        onClick={() =>
                          navigate(`/property/${item._id || item.id}`, {
                            state: { from: "admin" },
                          })
                        }
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="icon-action delete-listing-btn"
                        aria-label="Delete listing"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteListing(item._id || item.id);
                        }}
                      >
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
                {listingsLoading && (
                  <tr>
                    <td colSpan={7} style={{ color: "#9b9b9b", fontSize: 12, padding: 16, textAlign: "center" }}>
                      Loading listings…
                    </td>
                  </tr>
                )}
                {!listingsLoading && listings.length === 0 && (
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

        {/* USER DETAILS MODAL */}
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

        {/* REQUEST DETAILS MODAL */}
        {selectedRequest && (() => {
          const getRequesterDetails = (requesterId) => {
            if (!requesterId) return null;
            const id = typeof requesterId === "object" ? requesterId._id : requesterId;
            return users.find((u) => u._id === id) || null;
          };

          const user = getRequesterDetails(selectedRequest.requester) || selectedRequest.user || {};

          const name = user.fullName || user.name || selectedRequest.fullName || selectedRequest.name || "—";
          const email = user.email || selectedRequest.email || "—";
          const phone = user.phoneNumber || user.phone || selectedRequest.phoneNumber || selectedRequest.phone || "—";
          const docImg = selectedRequest.identityDocument || selectedRequest.image || selectedRequest.document || selectedRequest.file || selectedRequest.idImage;

          return (
            <div className="user-modal-overlay" onClick={() => setSelectedRequest(null)}>
              <div className="user-modal" onClick={(e) => e.stopPropagation()}>
                <button className="user-modal-close" onClick={() => setSelectedRequest(null)}>✕</button>
                <h2>Seller Request Details</h2>
                <p><strong>Applicant Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>

                {docImg && (
                  <div style={{ marginTop: 15 }}>
                    <p><strong>Identity Document:</strong></p>
                    <img
                      src={docImg}
                      alt="Identity Document"
                      style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, marginTop: 8 }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* REJECTION MODAL */}
        {rejectModal.open && (
          <div className="user-modal-overlay" onClick={() => setRejectModal({ open: false, id: null, type: null })}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <button className="user-modal-close" onClick={() => setRejectModal({ open: false, id: null, type: null })}>✕</button>
              <h2>Reject {rejectModal.type === "request" ? "Seller Request" : "Listing"}</h2>
              
              {modalError && (
                <div style={{ color: "#f26d6d", backgroundColor: "#3a1818", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "12px" }}>
                  {modalError}
                </div>
              )}

              <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "10px" }}>
                Please specify the clear reason for rejecting this {rejectModal.type}:
              </p>

              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (modalError) setModalError("");
                }}
                placeholder="Enter rejection reason..."
                style={{
                  width: "100%",
                  backgroundColor: "#121212",
                  color: "#fff",
                  border: "1px solid #2b2b2b",
                  borderRadius: "6px",
                  padding: "10px",
                  resize: "vertical",
                  marginBottom: "15px"
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => setRejectModal({ open: false, id: null, type: null })}
                  style={{ padding: "8px 16px", background: "#2b2b2b", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={rejecting || !isReasonValid}
                  style={{
                    padding: "8px 16px",
                    background: "#f26d6d",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: rejecting || !isReasonValid ? "not-allowed" : "pointer",
                    opacity: rejecting || !isReasonValid ? 0.6 : 1
                  }}
                >
                  {rejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteModal.open && (
          <div className="user-modal-overlay" onClick={() => setDeleteModal({ open: false, id: null, type: null })}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <button className="user-modal-close" onClick={() => setDeleteModal({ open: false, id: null, type: null })}>✕</button>
              <h2>Confirm Delete</h2>

              {modalError && (
                <div style={{ color: "#f26d6d", backgroundColor: "#3a1818", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "12px" }}>
                  {modalError}
                </div>
              )}

              <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "20px" }}>
                Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, type: null })}
                  style={{ padding: "8px 16px", background: "#2b2b2b", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  style={{
                    padding: "8px 16px",
                    background: "#f26d6d",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: deleting ? "not-allowed" : "pointer",
                    opacity: deleting ? 0.6 : 1
                  }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;