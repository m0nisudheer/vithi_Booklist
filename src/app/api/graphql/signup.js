import mercury from "@mercury-js/core";
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";

dotenv.config();

const resolvers = {
  Mutation: {
    // Signup mutation
    signUp: async (root, { signUpData }, ctx) => {
      try {
        const userSchema = mercury.db.User;
    
        // Check for existing user
        const existingUser = await userSchema.mongoModel.findOne({ email: signUpData.email });
        
        if (existingUser) {
          console.warn(`Signup attempted with existing email: ${signUpData.email}`);
          throw new GraphQLError("User Already Exists"); 
        }
    
        // Create new user
        const newUser = await userSchema.mongoModel.create({
          userName: signUpData.userName,
          email: signUpData.email,
          password: signUpData.password, 
          role: signUpData.role || "USER",
        });
    
        return {
          id: newUser.id,
          msg: "User Registered Successfully",
          role: newUser.role,
        };
      } catch (error) {
        console.error("Sign up error:", error);
        throw new GraphQLError(error.message); 
      }
    },    
    
    login: async (root, { email, password }) => {
      try {
        const userSchema = mercury.db.User;
        const user = await userSchema.mongoModel.findOne({ email });

        if (!user) {
          throw new GraphQLError("Invalid email or password");
        }

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          throw new GraphQLError("Invalid email or password");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "vithi",  
          { expiresIn: "30d" }
        );

        return {
          msg: "User successfully logged in",
          user: user.id,
          userName: user.userName,  // Returning username
          token: token,
          role: user.role,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new GraphQLError(error.message);
      }
    },

    
    addBook: async (root, { bookData }, { user }) => {
      try {
       
        if (!user) {
          throw new GraphQLError("Authentication required");
        }

        const bookSchema = mercury.db.Book;

     
        const newBook = await bookSchema.mongoModel.create({
          title: bookData.title,
          author: bookData.author,
          year: bookData.year,
          createdBy: user.id, 
        });

        return {
          id: newBook.id,
          title: newBook.title,
          author: newBook.author,
          year: newBook.year,
          createdBy: user.id,
          msg: "Book successfully created",
        };
      } catch (error) {
        console.error("AddBook error:", error);
        throw new GraphQLError(error.message);
      }
    },
  },

  Query: {
   
    books: async (root, args, ctx) => {
      try {
        const bookSchema = mercury.db.Book; 
        const books = await bookSchema.mongoModel.find(); 
        return books;
      } catch (error) {
        console.error("Error fetching books:", error);
        throw new GraphQLError("Unable to fetch books: " + error.message);
      }
    },

    
    book: async (root, { id }, ctx) => {
      try {
        const bookSchema = mercury.db.Book;

        const book = await bookSchema.mongoModel.findById(id).populate("createdBy", "userName");

        if (!book) {
          throw new GraphQLError("Book not found");
        }

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          year: book.year,
          createdBy: {
            id: book.createdBy._id,
            userName: book.createdBy.userName, 
          },
        };
      } catch (error) {
        console.error("Error fetching book:", error);
        throw new GraphQLError("Unable to fetch book: " + error.message);
      }
    },
  },
};

module.exports = resolvers;