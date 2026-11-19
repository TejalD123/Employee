
import dotenv from "dotenv";

dotenv.config();

console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);

const { default: app } = await import("./app.js");

await import("./config/db.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
