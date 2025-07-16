import express from "express";
import dotenv from "dotenv";
import app from "./index";

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
