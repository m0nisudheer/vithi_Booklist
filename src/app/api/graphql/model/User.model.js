import mercury from "@mercury-js/core";
export const User = mercury.createModel("User", {
  userName: {
    type: "string",
  },
  role: {
    type: "enum",
    enumType: "string",
    enum: ["USER", "ADMIN"],
  },
  email: {
    type: "string",
    // required: true,
    // unique: true,
  },
  password: {
    type: "string",
    // required: true,
    bcrypt:true
  },
});
