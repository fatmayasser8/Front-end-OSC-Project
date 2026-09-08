import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaHome,
  FaStore,
  FaUserTie,
  FaFileAlt,
  FaSearch,
  FaBell,
  FaEye,
  FaEllipsisH,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/adminDashboard.css";

const growthData = [
  { month: "Jan", users: 60, properties: 40 },
  { month: "Feb", users: 95, properties: 65 },
  { month: "Mar", users: 140, properties: 90 },
  { month: "Apr", users: 210, properties: 120 },
];

const roleData = [
  { name: "Buyers", value: 161, color: "#f5b301" },
  { name: "Sellers", value: 87, color: "#3a3a3a" },
];

const recentUsers = [
  { initials: "MA", name: "Mohamed Ali", role: "Buyer", time: "2 hours ago" },
  { initials: "SA", name: "Sara Ahmed", role: "Seller", time: "4 hours ago" },
  { initials: "YO", name: "Youssef Omar", role: "Buyer", time: "6 hours ago" },
  { initials: "NA", name: "Nour Abeer", role: "Seller", time: "8 hours ago" },
  { initials: "ZE", name: "Zeinab ElSayed", role: "Buyer", time: "10 hours ago" },
];

const recentListings = [
  {
    image: "../assets/about.png",
    title: "Modern Villa",
    location: "New Cairo",
    type: "For Sale",
    price: "$450,000",
    status: "Active",
    likedBy: "Ahmed Hassan",
  },
  {
    image: "../assets/about.png",
    title: "Luxury Apartment",
    location: "6 October",
    type: "For Sale",
    price: "$250,000",
    status: "Active",
    likedBy: "Sara Mohamed",
  },
  {
    image: "../assets/about.png",
    title: "Town House",
    location: "New Cairo",
    type: "For Rent",
    price: "$1,200 / month",
    status: "Active",
    likedBy: "Omar Khaled",
  },
  {
    image:"../assets/about.png",
    title: "Apartment",
    location: "Maadi",
    type: "For Sale",
    price: "$320,000",
    status: "Pending",
    likedBy: "Nour Ibrahim",
  },
];

const stats = [
  { icon: <FaUsers />, label: "Total Users", value: 248, change: "+12%", note: "vs last month", tone: "gold" },
  { icon: <FaHome />, label: "Total Properties", value: 156, change: "+8%", note: "vs last month", tone: "blue" },
  { icon: <FaStore />, label: "Sellers", value: 87, change: "+10%", note: "vs last month", tone: "green" },
  { icon: <FaUserTie />, label: "Buyers", value: 161, change: "+14%", note: "vs last month", tone: "red" },
  { icon: <FaFileAlt />, label: "Pending Requests", value: 23, change: "+5%", note: "vs last month", tone: "purple" },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="main-content full-width">
        <Link to="/" className="back-to-home">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        <div className="dashboard-topbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="topbar-right">
            <button className="icon-btn" aria-label="Notifications">
              <FaBell />
              <span className="notif-dot">3</span>
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
          <span className="welcome-date">April 26, 2025</span>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon tone-${s.tone}`}>{s.icon}</div>
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-change">
                  <span className="stat-change-up">↑ {s.change}</span> {s.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-row">
          <div className="chart-card growth-card">
            <h2>Platform Growth</h2>
            <div className="chart-legend">
              <span><i className="dot dot-gold" /> Users</span>
              <span><i className="dot dot-dark" /> Properties</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5b301" stopOpacity={0.35} />
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
                <Area type="monotone" dataKey="users" stroke="#f5b301" strokeWidth={2} fill="url(#usersFill)" />
                <Area type="monotone" dataKey="properties" stroke="#6b6b6b" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card roles-card">
            <h2>User Roles</h2>
            <div className="donut-wrapper">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {roleData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <strong>248</strong>
                <span>Total Users</span>
              </div>
            </div>
            <div className="roles-legend">
              <div className="roles-legend-item">
                <span><i className="dot dot-gold" /> Buyers</span>
                <span>161 (65%)</span>
              </div>
              <div className="roles-legend-item">
                <span><i className="dot dot-dark" /> Sellers</span>
                <span>87 (35%)</span>
              </div>
            </div>
          </div>

          <div className="chart-card recent-users-card">
            <div className="card-header-row">
              <h2>Recent Users</h2>
              <Link to="/admin/users" className="view-all-link">View All →</Link>
            </div>
            <ul className="recent-users-list">
              {recentUsers.map((u) => (
                <li key={u.name}>
                  <span className="avatar">{u.initials}</span>
                  <span className="user-name">{u.name}</span>
                  <span className={`role-tag role-${u.role.toLowerCase()}`}>{u.role}</span>
                  <span className="user-time">{u.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="listings-card">
          <div className="card-header-row">
            <h2>Recent Property Listings</h2>
            <Link to="/admin/properties" className="view-all-link">View All →</Link>
          </div>

          <div className="listings-table-wrapper">
            <table className="listings-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Liked By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((item) => (
                  <tr key={item.title}>
                    <td>
                      <img src={item.image} alt={item.title} className="listing-thumb" />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`type-tag ${item.type === "For Sale" ? "type-sale" : "type-rent"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.price}</td>
                    <td>
                      <span className={`status-tag ${item.status === "Active" ? "status-active" : "status-pending"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.likedBy}</td>
                    <td className="actions-cell">
                      <button className="icon-action" aria-label="View"><FaEye /></button>
                      <button className="icon-action" aria-label="More"><FaEllipsisH /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="footer-bottom">
          NOVA | Find Your Dream Home
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;