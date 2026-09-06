import Navbar from "../../components/Navbar/navbar";
import SearchBar from "../../components/searchBar/searchBar";
import Card from "../../components/propertyCard/propertyCard";
import Sidebar from "../../components/sideBar/sideBar";
import "../../styles/Home.css";

function Home() {
  return (
    <div className="home">

      {/* Sidebar */}
      <Sidebar />

      <div className="main-content">

        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section className="hero">

          <div className="hero-content">

            <span className="hero-badge">
              Find Your Dream Home
            </span>

            <h1>
              Your Next Chapter
              <br />
              <span>Starts Here</span>
            </h1>

            <p>
              Discover the perfect property, whether you're buying,
              renting, or investing.
            </p>

          </div>

        </section>

        {/* Search Bar */}
        <section className="search-section">
          <SearchBar />
        </section>

        {/* Properties */}
        <section className="properties-section">

          <div className="properties-header">
            <h2>1,248 Properties Found</h2>
          </div>

          <div className="row g-3">

            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />

          </div>

        </section>

      </div>

    </div>
  );
}

export default Home;