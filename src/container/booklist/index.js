"use client";

import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedBook, setEditedBook] = useState({
    id: "",
    title: "",
    author: "",
    year: "",
  });
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query GetBooks {
              books {
                id
                title
                author
                year
                createdOn
              }
            }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          alert("Error fetching books: " + data.errors[0].message);
        } else {
          setBooks(data.data.books || []);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        alert("An error occurred while fetching books.");
      } finally {
        setLoading(false);
      }
    };

    const role = sessionStorage.getItem("role");
    setUserRole(role);
    fetchBooks();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedBook(books[index]);
  };

  const handleSave = async () => {
    const updatedBooks = [...books];
    updatedBooks[editIndex] = editedBook;
    setBooks(updatedBooks);
    setEditIndex(-1);
    setEditedBook({ id: "", title: "", author: "", year: "" });

    try {
      const response = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation UpdateBook($input: updateBookInput!) {
            updateBook(input: $input) {
              title
              author
              year
            }
          }`,
          variables: {
            input: {
              id: editedBook.id,
              title: editedBook.title,
              author: editedBook.author,
              year: editedBook.year,
            },
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("GraphQL Error:", data.errors[0].message);
        alert("Error updating book: " + data.errors[0].message);
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("An error occurred while updating the book.");
    }
  };

  const handleRemove = async (index) => {
    const bookToRemove = books[index];

    try {
      const response = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation DeleteBook($deleteBookId: ID!) {
            deleteBook(id: $deleteBookId)
          }`,
          variables: {
            deleteBookId: bookToRemove.id,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("GraphQL Error:", data.errors[0].message);
        alert("Error deleting book: " + data.errors[0].message);
      } else {
        const updatedBooks = books.filter((_, i) => i !== index);
        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("An error occurred while deleting the book.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center md:text-3xl">
        Books List
      </h2>
      {loading ? (
        <div className="text-center text-lg font-semibold">
          Fetching books...
        </div>
      ) : books.length === 0 ? (
        <div className="text-center text-lg font-semibold">
          No books available.
        </div>
      ) : (
        <div>
          {/* For mobile view */}
          <div className="flex justify-center">
            <div className="md:hidden">
              <div className="flex flex-col items-center">
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className="border border-gray-300  p-2 mb-2 rounded-lg"
                  >
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold">Book Title:</td>
                          <td className="pl-8">
                            {editIndex === index ? (
                              <input
                                type="text"
                                name="title"
                                value={editedBook.title}
                                onChange={handleChange}
                                className="border border-black rounded-md p-0.5 w-3/4 text-left"
                              />
                            ) : (
                              <span className="text-lg">{book.title}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Author:</td>
                          <td className="pl-8">
                            {editIndex === index ? (
                              <input
                                type="text"
                                name="author"
                                value={editedBook.author}
                                onChange={handleChange}
                                className="border border-black rounded-md p-0.5 w-3/4 text-left"
                              />
                            ) : (
                              <span className="text-lg">{book.author}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Year:</td>
                          <td className="pl-8">
                            {editIndex === index ? (
                              <input
                                type="text"
                                name="year"
                                value={editedBook.year}
                                onChange={handleChange}
                                className="border border-black rounded-md p-0.5 w-3/4 text-left"
                              />
                            ) : (
                              <span className="text-lg">{book.year}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Created On:</td>
                          <td className="pl-8">
                            <span className="text-lg">
                              {new Date(book.createdOn).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                        {userRole === "ADMIN" && (
                          <tr>
                            <td colSpan="2">
                              <div className="flex justify-around">
                                {editIndex === index ? (
                                  <FaSave
                                    onClick={handleSave}
                                    className="h-6 w-6 text-green-500 cursor-pointer"
                                  />
                                ) : (
                                  <>
                                    <RiEdit2Fill
                                      onClick={() => handleEdit(index)}
                                      className="h-6 w-6 font-semibold text-blue-500 cursor-pointer"
                                    />
                                    <MdDelete
                                      onClick={() => handleRemove(index)}
                                      className="h-6 w-6 text-red-500 cursor-pointer"
                                    />
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* For larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-auto md:table-fixed">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border-4 border-gray-300 p-2 w-3/12 text-center md:text-xl font-bold">
                    Book Title
                  </th>
                  <th className="border-4  border-gray-300 p-2 w-3/12 text-center md:text-xl font-bold">
                    Book Author
                  </th>
                  <th className="border-4  border-gray-300 p-2 w-2/12 text-center md:text-xl font-bold">
                    Publish Year
                  </th>
                  <th className="border-4  border-gray-300 p-2 w-2/12 text-center md:text-xl font-bold">
                    Created On
                  </th>
                  {userRole === "ADMIN" && (
                    <th className="border-4  border-gray-300 p-2 w-1/12 text-center text-base md:text-xl font-bold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id} className="border-2 border-gray-300">
                    <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-4">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="title"
                          value={editedBook.title}
                          onChange={handleChange}
                          className="border border-black rounded-md p-1 w-full text-center"
                        />
                      ) : (
                        book.title
                      )}
                    </td>
                    <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-4">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="author"
                          value={editedBook.author}
                          onChange={handleChange}
                          className="border border-black rounded-md p-1 w-full text-center"
                        />
                      ) : (
                        book.author
                      )}
                    </td>
                    <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-4">
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="year"
                          value={editedBook.year}
                          onChange={handleChange}
                          className="border border-black rounded-md p-1 w-full text-center"
                        />
                      ) : (
                        book.year
                      )}
                    </td>
                    <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-4">
                      {new Date(book.createdOn).toLocaleDateString()}
                    </td>
                    {userRole === "ADMIN" && (
                      <td className="border-2 border-gray-300 text-center text-base md:text-xl md:p-4">
                        <div className="flex justify-center space-x-4">
                          {editIndex === index ? (
                            <FaSave
                              onClick={handleSave}
                              className="h-6 w-6 text-green-500 cursor-pointer"
                            />
                          ) : (
                            <>
                              <RiEdit2Fill
                                onClick={() => handleEdit(index)}
                                className="h-6 w-6 font-semibold text-blue-500 cursor-pointer"
                              />
                              <MdDelete
                                onClick={() => handleRemove(index)}
                                className="h-6 w-6 text-red-500 cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
