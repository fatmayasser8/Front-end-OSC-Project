import Navbar from "../../components/Navbar/navbar";
import SearchBar from "../../components/searchBar/searchBar";
import Card from "../../components/propertyCard/propertyCard";
import Sidebar from "../../components/sideBar/sideBar";
import "../../styles/Home.css";

function Home() {

  const properties = [
    {
      _id: "1",
      title: "Luxury Villa",
      location: "New Cairo",
      price: "8,500,000",
      bedrooms: 5,
      bathrooms: 3,
      area: 160,
      images: [],
      isFavorite: false,
    },
    {
      _id: "2",
      title: "Modern Apartment",
      location: "New Cairo",
      price: "4,200,000",
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      images: [],
      isFavorite: false,
    },
    {
      _id: "3",
      title: "Elegant Villa",
      location: "Fifth Settlement",
      price: "10,000,000",
      bedrooms: 6,
      bathrooms: 4,
      area: 220,
      images: [],
      isFavorite: false,
    },
    {
      _id: "4",
      title: "Cozy Apartment",
      location: "Nasr City",
      price: "2,800,000",
      bedrooms: 2,
      bathrooms: 1,
      area: 110,
      images: [],
      isFavorite: false,
    },
  ];


  return (
    <div className="home">

      {/* Sidebar */}
<Sidebar />

<div className="main-content !ml-0 md:!ml-[210px]">
  {/* Navbar */}
  <Navbar onMenuClick={() => window.dispatchEvent(new Event("openSidebar"))} />

        {/* Hero Section */}
        <section className="hero min-h-[250px] px-4 py-8 sm:min-h-[280px] sm:px-6 md:min-h-[300px] md:px-0 md:py-10">

          <div className="hero-content w-full max-w-none sm:max-w-[90%] md:w-[1200px] md:max-w-[90%]">

            <span className="hero-badge text-[10px] sm:text-[11px]">
              Find Your Dream Home
            </span>

            <h1 className="text-[28px] sm:text-[34px] md:text-[38px]">
              Your Next Chapter
              <br />
              <span>Starts Here</span>
            </h1>

            <p className="max-w-[330px] text-[12px] sm:max-w-[450px] sm:text-[14px]">
              Discover the perfect property, whether you're buying,
              renting, or investing.
            </p>

          </div>

        </section>

        {/* Search Bar */}
        <section className="search-section -mt-5 px-3 sm:-mt-[30px] sm:px-5 md:px-0">
          <SearchBar />
        </section>

        {/* Properties */}
        <section className="properties-section px-4 py-6 sm:px-5 sm:py-8 md:px-[25px] md:py-[35px]">

          <div className="properties-header mb-3">
            <h2 className="text-[16px] sm:text-[18px]">
              1,248 Properties Found
            </h2>
          </div>

          <div className="row g-3">

{properties.map((property) => (
  <Card
    key={property._id}
    property={property}
  />
))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default Home;