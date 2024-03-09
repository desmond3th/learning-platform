import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({path: './.env'})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "13kb"}))
app.use(express.urlencoded({extended: true, limit: "13kb"}))
app.use(express.static("public"))
app.use(cookieParser())


const PORT = process.env.PORT || 3000;

// import route
import instructorRoute from "./routes/instructor.routes.js";
import courseRoute from "./routes/course.routes.js";
import leadRoute from "./routes/lead.routes.js";

// declaration
app.use("/api/v1/instructor", instructorRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/lead", leadRoute)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app }