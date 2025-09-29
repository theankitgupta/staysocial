// Core Modules
import path from "path";
import { fileURLToPath } from "url";

// Third-Party Modules
import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";

// Local Modules
import listingRouter from "./routes/listing.routes.js";

//  Setup __dirname in ES Module format
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App Initialization
const app = express();

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use("/listings", listingRouter);

export default app;