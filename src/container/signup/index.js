"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
      role: "USER",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      userName: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const mutation = `
        mutation SignUp($signUpData: signUpInput!) {
          signUp(signUpData: $signUpData) {
            id
            msg
            role
          }
        }
      `;

      const variables = {
        signUpData: {
          email: values.email,
          userName: values.userName,
          password: values.password,
          role: values.role,
        },
      };

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: mutation,
            variables,
          }),
        });

        const result = await response.json();

        if (response.ok && result.data.signUp) {
          toast.success("User Registered Successfully", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            className: "border border-green-500",
          });
          formik.resetForm();
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          const errorMsg = result.errors
            ? result.errors[0].message
            : "An unknown error occurred";
          if (errorMsg === "User Already Exists") {
            toast.error("User Already Exists", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              draggable: true,
              className: "border border-red-500",
            });
          } else {
            toast.error("Registration Failed: " + errorMsg, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              draggable: true,
              className: "border border-red-500",
            });
          }
          formik.resetForm();
        }
      } catch (error) {
        toast.error("Network error: " + error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          className: "border border-red-500",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-4 bg-gray-800 shadow-lg rounded-lg border border-red-500">
        <h2 className="text-2xl font-semibold text-center mb-4 text-red-500">
          Sign Up
        </h2>

        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="email" className="block font-bold text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-1.5 mt-1 bg-gray-700 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="userName" className="block font-bold text-white">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-1.5 mt-1 bg-gray-700 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.userName && formik.errors.userName
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your username"
            />
            {formik.touched.userName && formik.errors.userName && (
              <div className="text-red-500 mt-1">{formik.errors.userName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block font-bold text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-1.5 mt-1 bg-gray-700 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block font-bold text-white">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              id="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-1.5 mt-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 mt-1">{formik.errors.role}</div>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className={`w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                formik.isSubmitting || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={formik.isSubmitting || loading}
            >
              {formik.isSubmitting || loading ? "Please wait..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Login
          </a>
        </p>
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

export default SignUp;
