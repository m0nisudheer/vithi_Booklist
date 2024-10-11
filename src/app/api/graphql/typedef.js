const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Queries for fetching books
  type Query {
    hello(name: String): String
   books: [Book]           # Fetch all books
    book(id: ID!): Book      # Fetch a specific book by ID
  }

  # Mutations for sign up, login, and adding a book
  type Mutation {
    signUp(signUpData: signUpInput): signUpResponse
    login(email: String!, password: String!): LoginResponse
    addBook(bookData: BookInput!): BookResponse   # Mutation for adding a book
  }

  # Response types for login and sign up
  type LoginResponse {
    msg: String
    token: String
    user: String
    role: String
    userName: String
  }

  type signUpResponse {
    id: String
    msg: String
    role: String
  }

  # Book type with only title, author, and year fields
  type Book {
    id: ID!
    title: String!
    author: String!
    year: String!
    createdBy: User!   # The user (admin) who created the book
  }

  # Response type when adding a book
  type BookResponse {
    id: ID!
    title: String!
    author: String!
    year: String!
    createdBy: User!
    msg: String
  }

  # Input types for signup and book creation
  input signUpInput {
    userName: String!
    email: String!
    password: String!
    role: UserRoleEnumType!  # Use UserRoleEnumType or roleType consistently
  }

  input BookInput {
    title: String!
    author: String!
    year: String!
  }

  # Enum for user roles
  enum UserRoleEnumType {  # If this is the enum name used elsewhere, keep it consistent
    USER
    ADMIN
  }

  # User type representing the user (admin/user) of the system
  type User {
    id: ID!
    userName: String!
    email: String!
    role: UserRoleEnumType!  # Use the same enum name here
  }
`;

module.exports = typeDefs;
