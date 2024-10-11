
import mercury from "@mercury-js/core";

const rules = [
  {
    modelName: "User",
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  {
    modelName: "Book",
    access: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  },
];

export const adminProfile = mercury.access.createProfile("ADMIN", rules);
