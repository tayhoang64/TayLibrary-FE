"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Repeat,
} from "lucide-react"
import { BASE_URL } from "../../constants"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("books")
  const [showAddBookForm, setShowAddBookForm] = useState(false)
  const [showEditBookForm, setShowEditBookForm] = useState(false)
  const [showDeleteBookConfirm, setShowDeleteBookConfirm] = useState(false)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [showEditUserForm, setShowEditUserForm] = useState(false)
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");




  //Sample data
  const [books, setBooks] = useState([
    {
      id: "1",
      title: "Amadeus: A Play by Peter Shaffer",
      author: "Peter Shaffer",
      publisher: "9780060935498",
      year: "",
      price: 7632,
      file: "",
      fullContent: 1981,
      stock: "Harper Perennial",
      image: "Drama",
      available: true,
    },
  ])



  const [user, setUser] = useState(null);

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
        console.log(respone);
        let data = Array.from(respone.data).map(book => {
          return {
            id: book.BookId,
            title: book.Title,
            author: book.Author,
            category: book.Categories?.map(cat => cat.CategoryName) || [],
            year: book.Year,
            price: book.Price,
            file: `${BASE_URL}/${book.File}`,
            image: `${BASE_URL}/${book.Image}`,
            fullcontent: book.FullContent,
            stock: book.Stock
          }
        });
        setBooks(data);
      })


  }, []);

  // Book CRUD operations
  const addBook = (newBook) => {
    setBooks([...books, { ...newBook, id: Date.now().toString() }])
    setShowAddBookForm(false)
  }

  const updateBook = (updatedBook) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
    setShowEditBookForm(false)
    setSelectedBook(null)
  }

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/book/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Xoá khỏi giao diện
        setBooks(books.filter((book) => book.id !== id));
        alert("Book deleted successfully!");
      } else {
        const result = await response.json();
        alert(`Error deleting book: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Something went wrong while deleting the book.");
    }

    setShowDeleteBookConfirm(false);
    setSelectedBook(null);
  }

  // User CRUD operations
  const addUser = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now().toString() }])
    setShowAddUserForm(false)
  }

  const updateUser = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setShowEditUserForm(false)
    setSelectedUser(null)
  }

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
    setShowDeleteUserConfirm(false)
    setSelectedUser(null)
  }




  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[208px] bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span className="text-2xl">Library Managerment</span>
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <nav className="flex-1">
          <div className="px-3 py-2">
            <SidebarItem
              label="Manage Books"
              active={activeSection === "books"}
              icon={<BookOpen className="h-4 w-4" />}
              onClick={() => setActiveSection("books")}
            />
            <SidebarItem
              label="Manage Borrow/Return"
              active={activeSection === "borrow"}
              icon={<Repeat className="h-4 w-4" />}
              onClick={() => {
                setActiveSection("borrow");
                navigate("/borrow-return");
              }}
            />
            <SidebarItem
              label="Home"
              active={activeSection === "home"}
              icon={<Home className="h-4 w-4" />}
              onClick={() => {
                setActiveSection("home");
                navigate("/");
              }}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[72px] border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-3xl font-bold">
            {activeSection === "books"
              ? "Manage Books"
              : activeSection === "users"
                ? "Manage Users"
                : activeSection === "borrow"
                  ? "Manage Borrow/Return"
                  : ""}
          </h1>


          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            </div>
          </div>
        </header>


        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Books Management */}
          {activeSection === "books" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Library Books</h2>
                  <div className="text-sm text-gray-500">{books.length} books total</div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search books..."
                      className="w-64 border border-gray-300 rounded-md py-1.5 px-3 pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    className="flex items-center gap-1 text-sm text-white py-1.5 px-3 bg-teal-600 rounded-md hover:bg-teal-700"
                    onClick={() => setShowAddBookForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Book</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-md border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Book</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Title & Author</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Year</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.filter((book) =>
                      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      book.author.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((book) => (
                      <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <img
                          src={book.image}
                          alt=""
                          className="h-[220px] w-[150px] object-cover rounded-md "
                        />
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 bg-gray-100">
                            </div>
                            <div>
                              <div className="font-medium">{book.title}</div>
                              <div className="text-sm text-gray-500">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {Array.isArray(book.category) ? book.category.join(", ") : "No category"}
                        </td>
                        <td className="py-3 px-4 text-sm">{book.year}</td>
                        <td className="py-3 px-4 text-sm">{book.price}</td>
                        {/* <td className="py-3 px-4 text-sm">{book.}</td> */}
                        <td className="py-3 px-4 text-sm">{book.stock}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="text-gray-600 hover:text-teal-600"
                              onClick={() => {
                                console.log(book);
                                setSelectedBook(book)
                                setShowEditBookForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-red-600"
                              onClick={() => {
                                setSelectedBook(book)
                                setShowDeleteBookConfirm(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{books.length}</span> of{" "}
                    <span className="font-medium">{books.length}</span> books
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeSection === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Library Users</h2>
                  <div className="text-sm text-gray-500">{users.length} users total</div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-64 border border-gray-300 rounded-md py-1.5 px-3 pr-10"
                    />
                    <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    className="flex items-center gap-1 text-sm text-white py-1.5 px-3 bg-teal-600 rounded-md hover:bg-teal-700"
                    onClick={() => setShowAddUserForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-md border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">User</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Barcode</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Member Since</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                            </div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4 text-sm">{user.barcode}</td>
                        <td className="py-3 px-4 text-sm">{user.role}</td>
                        <td className="py-3 px-4 text-sm">{user.memberSince}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="text-gray-600 hover:text-teal-600"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowEditUserForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-red-600"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteUserConfirm(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{users.length}</span> of{" "}
                    <span className="font-medium">{users.length}</span> users
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBookForm && <BookForm onClose={() => setShowAddBookForm(false)} onSave={addBook} />}

      {/* Edit Book Modal */}
      {showEditBookForm && selectedBook && (
        <BookForm
          book={selectedBook}
          onClose={() => {
            setShowEditBookForm(false)
            setSelectedBook(null)
          }}
          onSave={updateBook}
        />
      )}

      {/* Delete Book Confirmation */}
      {showDeleteBookConfirm && selectedBook && (
        <ConfirmationDialog
          title="Delete Book"
          message={`Are you sure you want to delete "${selectedBook.title}"? This action cannot be undone.`}
          onConfirm={() => deleteBook(selectedBook.id)}
          onCancel={() => {
            setShowDeleteBookConfirm(false);
            setSelectedBook(null);
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserForm && <UserForm onClose={() => setShowAddUserForm(false)} onSave={addUser} />}

      {/* Edit User Modal */}
      {showEditUserForm && selectedUser && (
        <UserForm
          user={selectedUser}
          onClose={() => {
            setShowEditUserForm(false)
            setSelectedUser(null)
          }}
          onSave={updateUser}
        />
      )}

      {/* Delete User Confirmation */}
      {showDeleteUserConfirm && selectedUser && (
        <ConfirmationDialog
          title="Delete User"
          message={`Are you sure you want to delete user "${selectedUser.name}"? This action cannot be undone.`}
          onConfirm={() => deleteUser(selectedUser.id)}
          onCancel={() => {
            setShowDeleteUserConfirm(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
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

function BookForm({ book, onClose, onSave }) {
  const isEditing = !!book;
  const [categoryList, setCategoryList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/category`)
      .then(res => {
        setCategoryList(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  const [formData, setFormData] = useState({
    id: book?.id || "",
    title: book?.title || "",
    author: book?.author || "",
    publisher: book?.publisher || "",
    year: book?.year || new Date().getFullYear(),
    price: book?.price || "",
    file: "",
    fullContent: book?.fullContent || "",
    stock: book?.stock || "",
    image: "",
    available: book?.available ?? true,
    category: book?.Categories?.map(cat => cat.CategoryId) || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "image") {
      setImageFile(file);
    } else if (e.target.name === "file") {
      setPdfFile(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.id);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("author", formData.author);
    form.append("publisher", formData.publisher);
    form.append("year", formData.year);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("status", formData.available ? "true" : "false");

    if (new FormData(e.target.parentElement.parentElement).get("file")) {
      form.append("file", new FormData(e.target.parentElement.parentElement).get("file"));
    }

    if (new FormData(e.target.parentElement.parentElement).get("image")) {
      form.append("image", new FormData(e.target.parentElement.parentElement).get("image"));
    }

    formData.category.forEach((catId) => {
      form.append("categoryIds", catId);
    });

    try {
      const response = await fetch(`${BASE_URL}/api/book/${formData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Book updated successfully!");
        onSave(result);
        onClose();
        window.location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Something went wrong!");
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("author", formData.author);
    form.append("publisher", formData.publisher);
    form.append("year", formData.year);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("status", formData.available ? "true" : "false");

    console.log(e.target.parentElement.parentElement);

    if (new FormData(e.target.parentElement.parentElement).get("file")) {
      form.append("file", new FormData(e.target.parentElement.parentElement).get("file"));
    }

    if (new FormData(e.target.parentElement.parentElement).get("image")) {
      form.append("image", new FormData(e.target.parentElement.parentElement).get("image"));
    }

    formData.category.forEach((catId) => {
      form.append("categoryIds", catId);
    });

    console.log(form.get("file"));
    console.log(form.get("image"));

    try {
      const response = await fetch(`${BASE_URL}/api/book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Book added successfully!");
        onSave(result);
        onClose();
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{isEditing ? "Edit Book" : "Add New Book"}</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={isEditing ? handleUpdateSubmit : handleAddSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="id" value={formData.id} hidden readOnly />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number" min="1900" max="2099"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <select
                  multiple
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value));
                    setFormData((prev) => ({ ...prev, category: selected }));
                  }}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 h-40"
                >
                  {categoryList.map((cat) => (
                    <option key={cat.CategoryId} value={cat.CategoryId}>
                      {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                  Available for checkout
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              {isEditing ?
                <button
                  onClick={handleUpdateSubmit}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
                >
                  Save Changes
                </button> : <button
                  onClick={handleAddSubmit}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
                >
                  Add Book
                </button>}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserForm({ user, onClose, onSave }) {
  const isEditing = !!user

  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    barcode: user?.barcode || "",
    role: user?.role || "Patron",
    memberSince: user?.memberSince || new Date().toISOString().split("T")[0],
    status: user?.status || "Active",
    avatarUrl: user?.avatarUrl || "/placeholder.svg?height=40&width=40",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{isEditing ? "Edit User" : "Add New User"}</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="Patron">Patron</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <input
                  type="date"
                  name="memberSince"
                  value={formData.memberSince}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
              >
                {isEditing ? "Save Changes" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

