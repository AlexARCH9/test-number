if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}

export const config = {
  PORT: process.env.PORT,
  URL_DATABASE: process.env.URL_DATABASE,
};
