"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const toastId = toast.info("Logging In...", {
        position: "top-center",
        autoClose: false,
        isLoading: true,
        className: "border border-orange-500", // Add border class for loading state
      });

      const mutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            msg
            token
            user  
            role
            userName
          }
        }
      `;

      const variables = {
        email: values.email,
        password: values.password,
      };

      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
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

        if (response.ok && result.data && result.data.login) {
          const { token, user, role, userName } = result.data.login;

          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userId", user);
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("userName", userName);

          toast.update(toastId, {
            render: "Login Successful",
            type: "success",
            autoClose: 2000,
            isLoading: false,
            className: "border border-green-500",
          });

          formik.resetForm();

          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          const errorMsg = result.errors
            ? result.errors[0].message
            : "An unknown error occurred";
          console.error("GraphQL error:", errorMsg);
          toast.update(toastId, {
            render: errorMsg,
            type: "error",
            autoClose: 2000,
            isLoading: false,
            className: "border border-red-500",
          });
        }
      } catch (error) {
        const errorMessage = "Network error: " + error.message;
        console.error("Network error:", errorMessage);
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          autoClose: 2000,
          isLoading: false,
          className: "border border-red-500",
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-4 bg-gray-800 shadow-lg rounded-lg border border-red-500">
        <h2 className="text-2xl font-semibold text-center mb-4 text-red-500">
          Login
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

          <div className="mb-4">
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
            <button
              type="submit"
              className={`w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Please wait..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-red-500 hover:underline">
            Sign Up
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

export default Login;
