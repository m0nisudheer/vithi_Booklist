"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  title: "",
  author: "",
  year: "",
};

const FormTable = ({ onClose }) => {
  const [zoomClass, setZoomClass] = useState("scale-110 opacity-0");

  useEffect(() => {
    setTimeout(() => {
      setZoomClass(
        "scale-100 opacity-100 transition-transform transition-opacity duration-500"
      );
    }, 100);
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      author: Yup.string().required("Author is required"),
      year: Yup.number()
        .typeError("Year must be a valid number")
        .required("Year is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation AddBook($bookData: BookInput!) {
                addBook(bookData: $bookData) {
                  title
                  author
                  year
                }
              }
            `,
            variables: {
              bookData: {
                title: values.title,
                author: values.author,
                year: values.year,
              },
            },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          toast.error("Error adding book: " + data.errors[0].message, {
            className: "border border-red-500 bg-black text-white", 
          });
        } else {
          // Show success toast
          toast.success("Book added successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "border border-green-500", 
          });
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error adding book:", error);
        toast.error("An error occurred while adding the book.", {
          className: "border border-red-500 bg-black text-white", 
        });
      }
    },
  });

  return (
    <div
      className={`p-4 fixed top-0 left-0 w-full h-full flex items-center justify-center ${zoomClass}`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm border border-red-500">
        <button
          className="absolute top-2 right-2 text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h1 className="text-xl font-semibold mb-3 text-center text-red-500">
          Book Details Form
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-bold text-white">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              className={`mt-1 block w-full border border-gray-600 rounded-md p-1 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-white">
              Book Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              id="author"
              onChange={formik.handleChange}
              value={formik.values.author}
              className={`mt-1 block w-full border border-gray-600 rounded-md p-1 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.author && formik.errors.author
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {formik.touched.author && formik.errors.author && (
              <div className="text-red-500 text-sm">{formik.errors.author}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-white">
              Publish Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="year"
              id="year"
              onChange={formik.handleChange}
              value={formik.values.year}
              className={`mt-1 block w-full border border-gray-600 rounded-md p-1 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.year && formik.errors.year
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            />
            {formik.touched.year && formik.errors.year && (
              <div className="text-red-500 text-sm">{formik.errors.year}</div>
            )}
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="submit"
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Add Book
            </button>
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
      position="top-center" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark" 
      />
    </div>
  );
};

export default FormTable;
