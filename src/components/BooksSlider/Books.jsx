import React, { useEffect, useState } from "react";
import Book1 from "../../assets/books/book1.jpg";
import Book2 from "../../assets/books/book2.jpg";
import Book3 from "../../assets/books/book3.jpg";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../constants";

// const booksData = [
//   {
//     id: 1,
//     img: Book1,
//     title: "Who's there",
//     rating: 5.0,
//     author: "Someone",
//   },
//   {
//     id: 2,
//     img: Book2,
//     title: "His Life",
//     rating: 4.5,
//     author: "John",
//   },
//   {
//     id: 3,
//     img: Book3,
//     title: "Lost boys",
//     rating: 4.7,
//     author: "Lost Girl",
//   },
//   {
//     id: 4,
//     img: Book2,
//     title: "His Life",
//     rating: 4.4,
//     author: "Someone",
//   },
//   {
//     id: 5,
//     img: Book1,
//     title: "Who's There",
//     rating: 4.5,
//     author: "Someone",
//   },
// ];

const Books = () => {
  const [booksData, setBooksData] = useState([]);
  useEffect(() =>{
    axios.get(`${BASE_URL}/api/book`)
      .then(respone => {
        console.log(respone);  // array of books
        let data = Array.from(respone.data).map(book =>{
          return {
            title: book.title,
            author: book.author,
            publisher: book.publisher,  
            year: book.year,
            price: book.price,
            file: `${BASE_URL}/api/book/file/${book.id}`,
            image: `${BASE_URL}/api/book/image/${book.id}`,
            fullcontent: book.fullcontent,
            stock: book.stock
          }
        });
        setBooksData(data);
      })

  },[]);
  return (
    <>
      <div className="mt-14 mb-12">
        <div className="container">
          {/* header */}
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Top Books for you
            </p>
            <h1 className="text-3xl font-bold">Top Books</h1>
            <p className="text-xs text-gray-400">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Perspiciatis delectus architecto error nesciunt,
            </p>
          </div>

          {/* Body section */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
              {/* Card */}
              {booksData.map((book) => (
                <div key={book.id} className="div space-y-3">
                  <img
                    src={book.image}
                    alt=""
                    className="h-[220px] w-[150px] object-cover rounded-md "
                  />
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-700">{book.author}</p>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      {/* <span>{rating}</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button className="text-center mt-10 cursor-pointer  bg-primary text-white py-1 px-5 rounded-md">
                View All Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;
