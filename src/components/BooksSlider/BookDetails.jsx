import { ArrowLeft, Heart, Share2, Star, ShoppingCart, BookOpen, Download, Clock } from "lucide-react"

const Button = ({ children, className, variant = "default" }) => {
  const baseStyles =
    "font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"

  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-current hover:bg-blue-50",
  }

  return <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</button>
}

export default function BookDetails() {
  return (
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
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Dashboard
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

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-full text-sm">
            Login/Signup
          </button>
        </div>
      </header>

      {/* Back button */}
      <div className="container mx-auto px-4 py-6">
        <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </a>
      </div>

      {/* Book Details Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left side - Book cover and actions */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-500 to-blue-700 p-8 flex flex-col items-center justify-center">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=500&width=350"
                  alt="His Life Book Cover"
                  className="w-64 h-auto shadow-lg rounded-md"
                />
                <div className="absolute top-3 right-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                  BESTSELLER
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="bg-white text-blue-600 hover:bg-gray-100 p-2 rounded-full">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-white text-blue-600 hover:bg-gray-100 p-2 rounded-full">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right side - Book details */}
            <div className="md:w-2/3 p-8">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Fiction</div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">His Life will forever be Changed</h1>
              <p className="text-gray-600 mt-1">
                By <span className="text-blue-600">Anonymous</span>
              </p>

              <div className="flex items-center mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.0 (120 reviews)</span>
              </div>

              <div className="mt-6">
                <div className="text-gray-900 text-sm mb-2">Price</div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">$24.99</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">$29.99</span>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                    Save 17%
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-gray-900 text-sm mb-2">Available Formats</div>
                <div className="flex space-x-3">
                  <div className="border border-blue-600 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Hardcover
                  </div>
                  <div className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    Paperback
                  </div>
                  <div className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    eBook
                  </div>
                  <div className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    Audiobook
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button className="py-2 px-6 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="text-blue-600 py-2 px-6 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Preview
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Instant Download</div>
                    <div className="text-xs text-gray-500">Get it now on your device</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Fast Delivery</div>
                    <div className="text-xs text-gray-500">Get physical copy in 2-3 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="border-t border-gray-200 px-8 py-6">
            {/* Description section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">About the Book</h3>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>

            {/* Details section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Book Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Publisher:</span>
                      <span className="font-medium">Acme Publishing</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Publication Date:</span>
                      <span className="font-medium">June 15, 2023</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">English</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">384</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">ISBN-13:</span>
                      <span className="font-medium">978-1234567890</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-4">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Fiction</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Contemporary
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Literary Fiction
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Drama</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Bestseller
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <Button className="py-1.5 px-4 text-sm">Write a Review</Button>
              </div>

              <div className="space-y-6">
                {/* Review 1 */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-10 h-10 rounded-full" />
                      <div className="ml-4">
                        <div className="font-medium">Sarah Johnson</div>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">2 days ago</div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    This book completely changed my perspective on life. The author's storytelling is captivating and
                    the character development is exceptional. I couldn't put it down!
                  </p>
                </div>

                {/* Review 2 */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-10 h-10 rounded-full" />
                      <div className="ml-4">
                        <div className="font-medium">Michael Thompson</div>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">1 week ago</div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    A thought-provoking read that stays with you long after you've finished. The prose is beautiful and
                    the themes are relevant to today's society.
                  </p>
                </div>

                {/* Review 3 */}
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-10 h-10 rounded-full" />
                      <div className="ml-4">
                        <div className="font-medium">Emily Rodriguez</div>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= 3 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">3 weeks ago</div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    While the concept was interesting, I found the pacing to be a bit slow in the middle. The ending was
                    satisfying though, and overall it was a good read.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="text-gray-700 border-gray-300 py-2 px-6">
                  Load More Reviews
                </Button>
              </div>
            </div>

            {/* Author section */}
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <img src="/placeholder.svg?height=200&width=200" alt="Author" className="w-full h-auto rounded-lg" />
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-lg font-semibold mb-2">About the Author</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                  </p>

                  <h4 className="text-md font-semibold mt-6 mb-3">Other Books by this Author</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <img
                        src="/placeholder.svg?height=150&width=100"
                        alt="Book cover"
                        className="w-full h-auto rounded shadow-sm"
                      />
                      <div className="mt-2 text-sm font-medium">The Silent Echo</div>
                    </div>
                    <div className="text-center">
                      <img
                        src="/placeholder.svg?height=150&width=100"
                        alt="Book cover"
                        className="w-full h-auto rounded shadow-sm"
                      />
                      <div className="mt-2 text-sm font-medium">Midnight Tales</div>
                    </div>
                    <div className="text-center">
                      <img
                        src="/placeholder.svg?height=150&width=100"
                        alt="Book cover"
                        className="w-full h-auto rounded shadow-sm"
                      />
                      <div className="mt-2 text-sm font-medium">The Last Journey</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2">You May Also Like</h2>
        <p className="text-gray-600 text-center mb-8">Readers who enjoyed this book also purchased</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Book 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=300&width=200" alt="Book cover" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Who's There</h3>
              <p className="text-gray-600 text-sm mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
              </p>
              <Button className="w-full py-1.5 px-4 text-sm">Order Now</Button>
            </div>
          </div>

          {/* Book 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=300&width=200" alt="Book cover" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Lost Boy</h3>
              <p className="text-gray-600 text-sm mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
              </p>
              <Button className="w-full py-1.5 px-4 text-sm">Order Now</Button>
            </div>
          </div>

          {/* Book 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=300&width=200" alt="Book cover" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">The Journey Within</h3>
              <p className="text-gray-600 text-sm mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
              </p>
              <Button className="w-full py-1.5 px-4 text-sm">Order Now</Button>
            </div>
          </div>

          {/* Book 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=300&width=200" alt="Book cover" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">Eternal Shadows</h3>
              <p className="text-gray-600 text-sm mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...
              </p>
              <Button className="w-full py-1.5 px-4 text-sm">Order Now</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white pt-12 pb-8 border-t">
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
    </div>
  )
}
