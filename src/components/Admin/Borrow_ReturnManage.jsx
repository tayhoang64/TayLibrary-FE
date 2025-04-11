"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, User, Book, Calendar, Clock, AlertCircle, CheckCircle, Home } from "lucide-react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants";

export default function BorrowReturnManagement() {
  const navigate = useNavigate();
  
  
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/borrowrecords`) 
      .then(response => {
        const rawData = response.data;
        console.log("Dữ liệu người mượn:", rawData);
        const formatted = rawData.map(record => {
          return {
            id: record.RecordId,
            name: record.User?.Username || "Không rõ",
            bookId: record.RecordDetails[0]?.Book?.id || null,
            bookTitle: record.RecordDetails[0]?.Book?.Title || "Không rõ",
            borrowDate: record.BorrowDate,
            returnDate: record.ReturnDate,
            status: record.Status
          };
        });

        setBorrowers(formatted);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, []);

  // Sample books data
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Book2",
      author: "Book1",
      category: "Tiểu thuyết, Trinh thám, Kinh dị",
      year: 2005,
      price: 12000,
      stock: 5,
    },
  ])

  // State for the new borrower form
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    bookId: "",
    borrowDate: new Date().toISOString().split("T")[0],
    ReturnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  // State for the return book form
  const [returnInfo, setReturnInfo] = useState({
    borrowerId: "",
    returnDate: new Date().toISOString().split("T")[0],
  })

  // State for active tab
  const [activeTab, setActiveTab] = useState("all")

  // State for search
  const [searchTerm, setSearchTerm] = useState("")

  // Filtered borrowers based on search and active tab
  const filteredBorrowers = borrowers.filter((borrower) => {
    const matchesSearch =
      borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      books
        .find((book) => book.id === borrower.bookId)
        ?.title.toLowerCase()
        .includes(searchTerm.toLowerCase())

    if (activeTab === "borrowing") {
      return matchesSearch && borrower.status === "borrowing"
    } else if (activeTab === "returned") {
      return matchesSearch && borrower.status === "returned"
    } else {
      return matchesSearch
    }
  })

  // Handle adding a new borrower
  const handleAddBorrower = (e) => {
    e.preventDefault()

    // Validate form
    if (!newBorrower.name || !newBorrower.bookId) {
      alert("Vui lòng điền đầy đủ thông tin người mượn và sách")
      return
    }

    // Check if book is available (stock > 0)
    const selectedBook = books.find((book) => book.id === Number.parseInt(newBorrower.bookId))
    if (!selectedBook || selectedBook.stock <= 0) {
      alert("Sách không có sẵn để cho mượn")
      return
    }

    // Add new borrower
    const newId = Math.max(...borrowers.map((b) => b.id), 0) + 1
    setBorrowers([
      ...borrowers,
      {
        id: newId,
        name: newBorrower.name,
        bookId: Number.parseInt(newBorrower.bookId),
        bookTitle: selectedBook.title,
        borrowDate: newBorrower.borrowDate,
        ReturnDate: newBorrower.ReturnDate,
        status: newBorrower.Status || "borrowing",
      },
    ])

    // Update book stock
    setBooks(
      books.map((book) =>
        book.id === Number.parseInt(newBorrower.bookId) ? { ...book, stock: book.stock - 1 } : book,
      ),
    )

    // Reset form
    setNewBorrower({
      name: "",
      bookId: "",
      borrowDate: new Date().toISOString().split("T")[0],
      ReturnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  // Handle returning a book
  const handleReturnBook = (e) => {
    e.preventDefault()

    // Validate form
    if (!returnInfo.borrowerId) {
      alert("Vui lòng chọn người mượn")
      return
    }

    // Update borrower status
    setBorrowers(
      borrowers.map((borrower) =>
        borrower.id === Number.parseInt(returnInfo.borrowerId)
          ? { ...borrower, status: "returned", returnDate: returnInfo.returnDate }
          : borrower,
      ),
    )

    // Update book stock
    const returnedBorrower = borrowers.find((b) => b.id === Number.parseInt(returnInfo.borrowerId))
    if (returnedBorrower) {
      setBooks(books.map((book) => (book.id === returnedBorrower.bookId ? { ...book, stock: book.stock + 1 } : book)))
    }

    // Reset form
    setReturnInfo({
      borrowerId: "",
      returnDate: new Date().toISOString().split("T")[0],
    })
  }
  const [activeSection, setActiveSection] = useState("books")
  // Calculate if a book is overdue
  const isOverdue = (ReturnDate, status) => {
    if (status === "returned") return false
    const today = new Date()
    const due = new Date(ReturnDate)
    return today > due
  }
  function SidebarItem({ label, active = false, icon = null, onClick }) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer ${active ? "text-teal-600 bg-teal-50" : "text-gray-600 hover:bg-gray-100"
          }`}
        onClick={onClick}
      >
        {icon && <span className={active ? "text-teal-600" : "text-gray-500"}>{icon}</span>}
        <span>{label}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with wave */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
        <SidebarItem
              label="Home"
              active={activeSection === "home"}
              icon={<Home className="h-4 w-4" />}
              onClick={() => {
                setActiveSection("home");
                navigate("/");
              }}
            />
          <h1 className="text-3xl font-bold mb-2">Quản lý Mượn/Trả Sách</h1>
          <p className="text-blue-100 mb-6">Theo dõi và quản lý việc mượn trả sách trong thư viện của bạn</p>

          {/* Search bar */}
          <div className="relative max-w-md mb-8">
            <input
              type="text"
              placeholder="Tìm kiếm người mượn hoặc sách..."
              className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Wave effect - adjusted height and position */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        {/* Tabs - moved up to overlap with wave */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden -mt-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "borrowing"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("borrowing")}
            >
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Borrowers list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === "borrowing"
                    ? "Danh sách người đang mượn sách"
                    : activeTab === "returned"
                      ? "Danh sách người đã trả sách"
                      : "Tất cả lượt mượn sách"}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người mượn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sách
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày mượn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạn trả
                      </th>
                      {activeTab !== "borrowing" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày trả
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBorrowers.length > 0 ? (
                      filteredBorrowers.map((borrower) => (
                        <tr key={borrower.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{borrower.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-6 bg-blue-50 border border-blue-100 rounded flex items-center justify-center mr-3">
                                <Book className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="text-sm text-gray-900">{borrower.bookTitle}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              {new Date(borrower.borrowDate).toLocaleDateString("vi-VN")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm flex items-center ${
                                isOverdue(borrower.returnDate, borrower.status)
                                  ? "text-red-600 font-medium"
                                  : "text-gray-900"
                              }`}
                            >
                              <Calendar
                                className={`h-4 w-4 mr-2 ${isOverdue(borrower.returnDate, borrower.status) ? "text-red-400" : "text-gray-400"}`}
                              />
                              {new Date(borrower.returnDate).toLocaleDateString("vi-VN")}
                              {isOverdue(borrower.returnDate, borrower.status) && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Quá hạn
                                </span>
                              )}
                            </div>
                          </td>
                          {activeTab !== "borrowing" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                {borrower.returnDate ? new Date(borrower.returnDate).toLocaleDateString("vi-VN") : "-"}
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${
                                borrower.status === "borrowing"
                                  ? isOverdue(borrower.returnDate, borrower.status)
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {borrower.status === "borrowing" ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Đang mượn
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Đã trả
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {borrower.status === "borrowing" && (
                              <button
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors mr-2"
                                onClick={() => {
                                  setReturnInfo({
                                    ...returnInfo,
                                    borrowerId: borrower.id.toString(),
                                  })
                                }}
                              >
                                Trả sách
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={activeTab !== "borrowing" ? 7 : 6}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <Book className="h-10 w-10 text-gray-300 mb-2" />
                            <p>Không có dữ liệu</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column - Forms */}
          <div className="lg:col-span-1 space-y-8">
            {/* Borrow Book Form */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <h2 className="text-lg font-semibold flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Cho mượn sách
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddBorrower}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người mượn</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên người mượn"
                      value={newBorrower.name}
                      onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sách</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newBorrower.bookId}
                      onChange={(e) => setNewBorrower({ ...newBorrower, bookId: e.target.value })}
                      required
                    >
                      <option value="">Chọn sách</option>
                      {books
                        .filter((book) => book.stock > 0)
                        .map((book) => (
                          <option key={book.id} value={book.id}>
                            {book.title} - {book.author} (Còn {book.stock})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày mượn</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newBorrower.borrowDate}
                        onChange={(e) => setNewBorrower({ ...newBorrower, borrowDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hạn trả</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newBorrower.ReturnDate}
                        onChange={(e) => setNewBorrower({ ...newBorrower, ReturnDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Cho mượn sách
                  </button>
                </form>
              </div>
            </div>

            {/* Return Book Form */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                <h2 className="text-lg font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Trả sách
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleReturnBook}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người mượn</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={returnInfo.borrowerId}
                      onChange={(e) => setReturnInfo({ ...returnInfo, borrowerId: e.target.value })}
                      required
                    >
                      <option value="">Chọn người mượn</option>
                      {borrowers
                        .filter((borrower) => borrower.status === "borrowing")
                        .map((borrower) => (
                          <option key={borrower.id} value={borrower.id}>
                            {borrower.name} - {borrower.bookTitle}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={returnInfo.returnDate}
                      onChange={(e) => setReturnInfo({ ...returnInfo, returnDate: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận trả sách
                  </button>
                </form>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Book className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Đang mượn</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {borrowers.filter((b) => b.status === "borrowing").length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Đã trả</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {borrowers.filter((b) => b.status === "returned").length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">Quá hạn</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      {borrowers.filter((b) => b.status === "borrowing" && isOverdue(b.ReturnDate, b.status)).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
