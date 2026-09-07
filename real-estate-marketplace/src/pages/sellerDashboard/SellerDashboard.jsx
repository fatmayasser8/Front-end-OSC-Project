import "../../styles/SellerDashboard.css";

import villa1 from "../../assets/hero.png";
import userImg from "../../assets/user-img.jpg";
import {Link} from "react-router-dom";

function SellerDashboard() {
  return (
    <div className="dashboard-page">


  {/* Back Button */}
  <Link to="/home" className="dashboard-back">
    <i className="fa-solid fa-arrow-left"></i>
    Back to Home
  </Link>

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">

        <div>
          <h1>
            Good Morning, Malak 👋
          </h1>

          <p>
            Here's what's happening with your properties today.
          </p>
        </div>

        <button className="date-btn">
          <i className="fa-regular fa-calendar"></i>
          Today, Sep 6, 2026
          <i className="fa-solid fa-chevron-down"></i>
        </button>

      </div>


      {/* ================= STATISTICS ================= */}
      <section className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="stat-icon">
            <i className="fa-solid fa-house"></i>
          </div>

          <div>
            <span>Total Properties</span>
            <strong>8</strong>
            <small>
              <i className="fa-solid fa-arrow-up"></i>
              2 new
            </small>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon">
            <i className="fa-solid fa-eye"></i>
          </div>

          <div>
            <span>Total Views</span>
            <strong>1,245</strong>
            <small>
              <i className="fa-solid fa-arrow-up"></i>
              12%
            </small>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon">
            <i className="fa-solid fa-envelope"></i>
          </div>

          <div>
            <span>Total Inquiries</span>
            <strong>18</strong>
            <small>
              <i className="fa-solid fa-arrow-up"></i>
              5%
            </small>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon">
            <i className="fa-solid fa-chart-column"></i>
          </div>

          <div>
            <span>Total Sales</span>
            <strong>2</strong>
            <small>
              <i className="fa-solid fa-arrow-up"></i>
              1 this month
            </small>
          </div>
        </div>

      </section>


      {/* ================= CHARTS ================= */}
      <section className="dashboard-charts">

        {/* Views Overview */}
        <div className="dashboard-card views-card">

          <div className="card-header">
            <h2>Views Overview</h2>

            <button>
              Last 7 days
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          <div className="chart-area">

            <div className="y-axis">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div className="line-chart">

              <div className="grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <svg
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#d4af37"
                      stopOpacity="0.45"
                    />

                    <stop
                      offset="100%"
                      stopColor="#d4af37"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 170
                     C35 160, 45 130, 75 145
                     C105 160, 125 115, 155 135
                     C185 155, 210 125, 235 135
                     C265 150, 280 85, 315 105
                     C350 125, 360 145, 395 110
                     C430 75, 455 130, 485 100
                     C515 70, 535 85, 560 45
                     C575 25, 590 55, 600 35
                     L600 220
                     L0 220 Z"
                  fill="url(#chartGradient)"
                />

                <path
                  d="M0 170
                     C35 160, 45 130, 75 145
                     C105 160, 125 115, 155 135
                     C185 155, 210 125, 235 135
                     C265 150, 280 85, 315 105
                     C350 125, 360 145, 395 110
                     C430 75, 455 130, 485 100
                     C515 70, 535 85, 560 45
                     C575 25, 590 55, 600 35"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <div className="x-axis">
                <span>Sep 1</span>
                <span>Sep 2</span>
                <span>Sep 3</span>
                <span>Sep 4</span>
                <span>Sep 5</span>
                <span>Sep 6</span>
              </div>

            </div>

          </div>

        </div>


        {/* Property Status */}
        <div className="dashboard-card status-card">

          <div className="card-header">
            <h2>Property Status</h2>
          </div>

          <div className="status-content">

            <div className="donut-chart">
              <div className="donut-center">
                <strong>8</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="status-list">

              <div>
                <span className="status-dot sale"></span>
                <p>For Sale</p>
                <strong>5</strong>
              </div>

              <div>
                <span className="status-dot sold"></span>
                <p>Sold</p>
                <strong>2</strong>
              </div>

              <div>
                <span className="status-dot pending"></span>
                <p>Pending</p>
                <strong>1</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM ================= */}
      <section className="dashboard-bottom">

        {/* Recent Properties */}
        <div className="dashboard-card recent-card">

          <div className="card-header">
            <h2>Recent Properties</h2>

            <button className="view-all">
              View All
            </button>
          </div>


          <div className="property-list">

            <div className="property-row">

              <img src={villa1} alt="Luxury Villa" />

              <div className="property-name">
                <strong>Luxury Villa</strong>
                <span>New Cairo</span>
              </div>

              <span className="property-price">
                EGP 8,500,000
              </span>

              <span className="property-status for-sale">
                For Sale
              </span>

            </div>


            <div className="property-row">

              <img src={villa1} alt="Modern Apartment" />

              <div className="property-name">
                <strong>Modern Apartment</strong>
                <span>Zamalek</span>
              </div>

              <span className="property-price">
                EGP 6,200,000
              </span>

              <span className="property-status for-sale">
                For Sale
              </span>

            </div>


            <div className="property-row">

              <img src={villa1} alt="Penthouse" />

              <div className="property-name">
                <strong>Penthouse</strong>
                <span>October City</span>
              </div>

              <span className="property-price">
                EGP 10,500,000
              </span>

              <span className="property-status pending">
                Pending
              </span>

            </div>


            <div className="property-row">

              <img src={villa1} alt="Duplex" />

              <div className="property-name">
                <strong>Duplex</strong>
                <span>New Cairo</span>
              </div>

              <span className="property-price">
                EGP 7,300,000
              </span>

              <span className="property-status for-sale">
                For Sale
              </span>

            </div>

          </div>

        </div>


        {/* Recent Inquiries */}
        <div className="dashboard-card recent-card">

          <div className="card-header">
            <h2>Recent Inquiries</h2>

            <button className="view-all">
              View All
            </button>
          </div>


          <div className="inquiry-list">

            <div className="inquiry-row">

              <img src={userImg} alt="Sarah Ahmed" />

              <div>
                <strong>Sarah Ahmed</strong>

                <p>
                  I'm interested in the Luxury Villa. Is it still available?
                </p>
              </div>

              <small>2h ago</small>

            </div>


            <div className="inquiry-row">

              <img src={userImg} alt="Mohamed Ali" />

              <div>
                <strong>Mohamed Ali</strong>

                <p>
                  Can you share more photos of the apartment?
                </p>
              </div>

              <small>5h ago</small>

            </div>


            <div className="inquiry-row">

              <img src={userImg} alt="Nour Hassan" />

              <div>
                <strong>Nour Hassan</strong>

                <p>
                  What's the exact location of the penthouse?
                </p>
              </div>

              <small>1d ago</small>

            </div>


            <div className="inquiry-row">

              <img src={userImg} alt="Omar Khaled" />

              <div>
                <strong>Omar Khaled</strong>

                <p>
                  Is there a discount for long-term rental?
                </p>
              </div>

              <small>1d ago</small>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SellerDashboard;