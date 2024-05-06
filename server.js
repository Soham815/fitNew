const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

const staticDirectory = path.join(__dirname, "public");
app.use(express.static(staticDirectory));
app.use(bodyParser.urlencoded({ extended: true }));

// Schema Defination
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	fname: String,
	goal1: String,
	goal2: String,
	goal3: String,
	activityLevel: String,
	activityLevelValue: Number,
	gender: String,
	dob: String,
	age: Number,
	country: String,
	zipCode: String,
	heightUnit: String,
	weightUnit: String,
	heightFt: Number,
	heightInches: Number,
	heightCenti: Number,
	weightLbs: Number,
	weightKg: Number,
	goalWeightLbs: Number,
	goalWeightKg: Number,
	weightDiffKg: Number,
	weightDiffLbs: Number,
	targetWeeks: Number,
	caloriesCalculated: Number,
	carbs: Number,
	protein: Number,
	fat: Number,
});

let User = mongoose.model("users", userSchema);

// Schema Defination End

//Mongo Connect and function definations
const url =
	"mongodb+srv://pradnyaBaad:PdVPzoPrzbIBcTwb@cluster0.djrjwkp.mongodb.net/";
mongoose.connect(url).then(console.log("connected successfully"));

app.post("/", async (req, res) => {
	res.sendFile(path.join(staticDirectory, "index.html"));
});

app.post("/welcomePage", async (req, res) => {
	res.sendFile(path.join(staticDirectory, "welcomePage.html"));
});

app.post("/registration", async (req, res) => {
	res.sendFile(path.join(staticDirectory, "registration.html"));
});

app.post("/signin", async (req, res) => {
	res.sendFile(path.join(staticDirectory, "signin.html"));
});

// Example endpoint for user validation
app.post("/validateUser", async (req, res) => {
	const { username } = req.body;

	const isUnique = !(await User.findOne({ username }));
	res.json({ isUnique });
});

app.post("/createUser", async (req, res) => {
	const userData = req.body;
	await User.insertMany(userData);
	res.status(200).send("Data received successfully.");
});

app.post("/validatePassword", async (req, res) => {
	try {
		const { username, password } = req.body;

		// Find the user by username in the database
		const user = await User.findOne({ username });

		// If the user is not found, return an error
		if (!user) {
			res.status(400).send("Invalid Username or Password");
		}

		// If passwords match, return success
		if (password === user.password) {
			res.status(200).json(username);
		} else {
			res.status(400).send("Invalid Username or Password");
		}
	} catch (error) {
		console.error(error);
		res.send("Internal Server Error");
	}
});

app.post("/calculateCalories", async (req, res) => {
	try {
		const { age, gender, height, weight, activityLevelValue, goal } = req.body;
		let bmr;
		if (gender == "Male") {
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		}
		let calories = Math.round(bmr * activityLevelValue);
		if (goal == "Gain Weight") {
			calories += 500;
		} else if (goal == "Lose Weight") {
			calories -= 500;
		}
		res.json({ calories });
	} catch (error) {
		console.error(error);
		res.send("Internal Server Error");
	}
});

app.post("/dashboard", async (req, res) => {
	// Assume 'parameterValue' is the parameter you want to send
	const parameterValue = req.body.user; // Adjust this to extract the parameter from the request
	// Read the contents of demo.html
	fs.readFile(
		path.join(staticDirectory, "dashboard.html"),
		"utf8",
		(err, htmlData) => {
			if (err) {
				console.error("Error reading demo.html file:", err);
				res.status(500).send("Internal Server Error");
				return;
			}

			// Modify the HTML content to include the parameter as a JavaScript variable
			const modifiedHtmlData = htmlData.replace(
				"/* hiddenuser_placeholder */",
				`var parameterValue = '${parameterValue}';`
			);

			// Send the modified HTML content
			res.send(modifiedHtmlData);
		}
	);
});

app.post("/retriveData", async (req, res) => {
	try {
		const { username } = req.body;

		// Find the user by username in the database
		const user = await User.findOne({ username });

		// If the user is not found, return an error
		if (!user) {
			res.status(400).send("Invalid Username or Password");
		}

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.send("Internal Server Error");
	}
});

app.listen(port, async () => {
	console.log(`Server is running on http://localhost:${port}`);
});
