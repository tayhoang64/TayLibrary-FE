"use client"

import { useEffect, useState } from "react"
import { Search, Filter, ChevronDown, Grid, List, SlidersHorizontal, X, Link, BookOpen, CalendarCheck } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "../../constants"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";

const Button = ({ children, className, variant = "default" }) => {
  const baseStyles =
    "font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"

  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-current hover:bg-blue-50",
    ghost: "hover:bg-gray-100",
  }

  return <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</button>
}

export default function ViewAllBooks() {
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("popularity")
  const [booksData, setBooksData] = useState([]);
  const [User, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${BASE_URL}/api/user/current`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          console.log("User data:", response.data);
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
    axios.get(`${BASE_URL}/api/book`)
      .then(respone => {
        console.log(respone);  // array of books
        let data = Array.from(respone.data).map(book => {
          return {
            id: book.BookId,
            title: book.Title,
            author: book.Author,
            publisher: book.Publisher,
            year: book.Year,
            price: book.Price,
            file: `${BASE_URL}/${book.File}`,
            image: `${BASE_URL}/${book.Image}`,
            fullcontent: book.Fullcontent,
            stock: book.Stock
          }
        });
        setBooksData(data);
      })
  }, []);




  // Toggle genre selection
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenres([])
    setPriceRange([0, 100])
  }
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  return (
    <>
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Rent: {selectedBook.title}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const quantity = formData.get("quantity")
                const borrowDate = formData.get("borrowDate")
                const returnDate = formData.get("returnDate")
                // console.log("Renting:", selectedBook, borrowDate, returnDate)
                // Gửi dữ liệu về backend ở đây nếu cần
                console.log(selectedBook)

                const payload = {
                  BorrowDate: new Date(borrowDate).toISOString(),
                  ReturnDate: new Date(returnDate).toISOString(),
                  CardNumber: User?.CardNumber,
                  Status: "PENDING",
                  Arr: [[selectedBook.id, quantity]],
                };

                fetch(`${BASE_URL}/api/borrowrecords`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                  },
                  body: JSON.stringify(payload)
                })
                  .then(async res => {
                    if (!res.ok) {
                      const text = await res.text();
                      throw new Error(text || `HTTP ${res.status}`);
                    }
                    const text = await res.text();
                    return text ? JSON.parse(text) : {};
                  })
                  .then(data => {
                    if (data.error) throw new Error(data.error);
                    alert("Gửi yêu cầu mượn thành công!");
                  })
                  .catch(err => {
                    console.error(err);
                    alert(err.message);
                  });

                setSelectedBook(null)
                toast({ title: "Book rented successfully!" })
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Date</label>
                <input
                  name="borrowDate"
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input
                  name="returnDate"
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Rent
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header/Navigation - matching existing site */}
        <header className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="font-bold text-xl">Books</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 flex items-center">
                  Quick Links
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {User == null ? (
              <button
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
              >
                <Link to="/login">Login/Signup</Link>
              </button>
            ) : (
              <div className="relative inline-block text-left">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full"
                >
                  Hello, {User.Username}
                </div>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Title */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Book Collection</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Discover thousands of books across various genres. Find your next favorite read today.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-2xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* View and Filter Controls */}
              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="hidden md:flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    className={`p-2 ${viewMode === "grid" ? "" : "text-gray-600"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    className={`p-2 ${viewMode === "list" ? "" : "text-gray-600"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                {/* <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-low">Sort by: Price (Low to High)</option>
                    <option value="price-high">Sort by: Price (High to Low)</option>
                    <option value="a-z">Sort by: Name (A - Z)</option>
                    <option value="z-a">Sort by: Name (Z - A)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div> */}


                {/* Filter Button (Mobile) */}
                <Button
                  variant="outline"
                  className="md:hidden border-gray-300 text-gray-700 py-2 px-4 flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>

                {/* Filter Button (Desktop) */}
                {/* <Button
                variant="outline"
                className="hidden md:flex border-gray-300 text-gray-700 py-2 px-4 items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {selectedGenres.length > 0 && (
                  <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {selectedGenres.length}
                  </span>
                )}
              </Button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div
              className={`md:w-1/4 lg:w-1/5 bg-white p-4 rounded-lg shadow-sm ${showFilters ? "block" : "hidden md:block"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {(selectedGenres.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
                  <Button
                    variant="ghost"
                    className="text-sm text-blue-600 py-1 px-2 flex items-center"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Genre Filter */}
              {/* <div className="mb-6">
                <h3 className="font-medium mb-2">Genre</h3>
                <div className="space-y-2">
                  {["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Romance", "Biography", "Self-Help"].map(
                    (genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{genre}</span>
                      </label>
                    ),
                  )}
                </div>
              </div> */}

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()} $</span>
                <span>{priceRange[1].toLocaleString()} $</span>
              </div>
              {/* Format Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Format</h3>
                <div className="space-y-2">
                  {["Hardcover", "Paperback", "eBook", "Audiobook"].map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button (Mobile) */}
              <div className="md:hidden">
                <Button className="w-full py-2">Apply Filters</Button>
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1">
              {/* Active Filters */}
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedGenres.map((genre) => (
                    <span
                      key={genre}
                      className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {genre}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center p-0.5 text-sm bg-transparent rounded-full hover:bg-blue-200"
                        onClick={() => toggleGenre(genre)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <Button
                    variant="ghost"
                    className="text-xs text-blue-600 py-1 px-2.5"
                    onClick={() => setSelectedGenres([])}
                  >
                    Clear filters
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-gray-600 mb-6">Showing 1-24 of 156 books</div>

              {/* Grid View */}
              <div>
                {viewMode === "grid" ? (
                  // GRID VIEW
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {booksData
                      .filter(
                        (book) =>
                          book.price >= priceRange[0] && book.price <= priceRange[1]
                      )
                      .filter((book) => {
                        const keyword = searchTerm.toLowerCase();
                        return (
                          book.title.toLowerCase().includes(keyword) ||
                          book.author.toLowerCase().includes(keyword) ||
                          book.isbn?.toLowerCase().includes(keyword)
                        );
                      })
                      .map((book, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative">
                            <img
                              src={book.image}
                              alt="Book cover"
                              className="w-full h-56 object-cover"
                            />
                            {book.stock > 10 && (
                              <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                BESTSELLER
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1 hover:text-blue-600">
                              <a href="/book-details">{book.title}</a>
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">By {book.author}</p>
                            <div className="flex items-baseline mb-3">
                              <span className="text-lg font-bold text-gray-900">${book.price}</span>
                            </div>
                            <button
                              onClick={() => setSelectedBook(book)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <CalendarCheck className="w-4 h-4" />
                              Rent
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                ) : (
                  // LIST VIEW
                  // <div className="space-y-4">
                  //   {booksData.map((book, index) => (
                  //     <div
                  //       key={index}
                  //       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  //     >
                  //       <div className="flex flex-col md:flex-row">
                  //         <div className="md:w-1/4 relative">
                  //           <img
                  //             src={book.image}
                  //             alt="Book cover"
                  //             className="w-full h-56 md:h-full object-cover"
                  //           />
                  //           {book.stock > 10 && (
                  //             <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                  //               BESTSELLER
                  //             </div>
                  //           )}
                  //         </div>
                  //         <div className="p-4 md:w-3/4">
                  //           <h3 className="font-semibold text-xl mb-1 hover:text-blue-600">
                  //             <a href="/book-details">{book.title}</a>
                  //           </h3>
                  //           <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
                  //           <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  //             {book.fullcontent?.slice(0, 150) || "No description available."}
                  //           </p>
                  //           <div className="flex flex-wrap items-center justify-between">
                  //             <div className="flex items-baseline mb-2 md:mb-0">
                  //               <span className="text-lg font-bold text-gray-900">${book.price}</span>
                  //             </div>
                  //             <Button className="py-1.5 px-4 text-sm">Add to Cart</Button>
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   ))}
                  // </div>
                  "")}
              </div>


              {/* Pagination */}
              <div className="flex justify-center mt-10">
                <nav className="inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-l-md border border-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-blue-600 bg-blue-50 border-t border-b border-gray-300"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
                  >
                    ...
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
                  >
                    8
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white rounded-r-md border border-gray-300 hover:bg-gray-50"
                  >
                    Next
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white pt-12 pb-8 border-t mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span className="font-bold text-xl">Books Store</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  Phasumis, volutpat.
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Noida, Uttar Pradesh
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  +91 123456789
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Important Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Home
                    </a>
                  </li>t co
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center">
                      <span className="mr-2">›</span> Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                ©copyright 2024 All rights reserved | Made with ❤️ by Dishad
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div></>
  )
}
