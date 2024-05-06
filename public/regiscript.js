const cards = document.getElementsByClassName("formDisplayer");
const progressBar = document.querySelector(".progressbar");
const goals = document.getElementsByClassName("option");
for (const card of cards) {
	card.style.display = "none";
}
let currentCard = 0;
cards[currentCard].style.display = "flex";
progressBar.style.width = `${12.5 * (currentCard + 1)}%`;
currentHeightUnit = "feet/inches";
currentWeightUnit = "lbs";

let userData = {
	username: "",
	password: "",
	fname: "",
	goal1: "",
	goal2: "",
	goal3: "",
	activityLevel: "",
	activityLevelValue: 1,
	gender: "",
	dob: "",
	age: 0,
	country: "",
	zipCode: "",
	heightUnit: "",
	weightUnit: "",
	heightFt: 0,
	heightInches: 0,
	heightCenti: 0,
	weightLbs: 0,
	weightKg: 0,
	goalWeightLbs: 0,
	goalWeightKg: 0,
	WeightDiffKg: 0,
	WeightDiffLbs: 0,
	targetWeeks: 0,
	caloriesCalculated: 0,
	carbs: 0,
	protein: 0,
	fat: 0,
};

async function showNext() {
	switch (currentCard) {
		case 0:
			const fullName = document.getElementById("firstName");
			if (fullName.value == "") {
				alert("Name must be filled out");
				return;
			}
			userData["fname"] = fullName.value;
			const c2head = document.querySelector(".card-2-main-heading");
			c2head.innerHTML = `Thanks ${fullName.value}! Now for your goals.`;
			break;
		case 1:
			let colorCount = 0;
			for (let j = 0; j < 7; j++) {
				const properties = getComputedStyle(goals[j]);
				if (properties["color"] == "rgb(255, 71, 57)") {
					colorCount++;
				}
				if (j == 2 && colorCount == 0) {
					alert("Please select one 1 weight goal");
					return;
				}
			}

			if (colorCount < 3) {
				alert("Please select up to 3 including 1 weight goal");
				return;
			}

			let count = 1;
			for (let j = 0; j < 7; j++) {
				const properties = getComputedStyle(goals[j]);
				if (properties["color"] == "rgb(255, 71, 57)") {
					if (count == 1) {
						userData["goal1"] = goals[j].innerHTML;
						count++;
						continue;
					}
					if (count == 2) {
						userData["goal2"] = goals[j].innerHTML;
						count++;
						continue;
					}
					if (count == 3) {
						userData["goal3"] = goals[j].innerHTML;
					}
				}
			}
			break;
		case 3:
			flag = 1;
			activityOptions = document.getElementsByClassName("option-text-1");
			for (let j = 7; j < 11; j++) {
				const properties = getComputedStyle(goals[j]);
				if (properties["color"] == "rgb(255, 71, 57)") {
					flag = 0;
					userData["activityLevel"] = activityOptions[j - 7].innerHTML;
					userData["activityLevelValue"] = Number(
						activityOptions[j - 7].getAttribute("data-value")
					);
					break;
				}
			}
			if (flag == 1) {
				alert("Please Select any one");
				return;
			}
			break;
		case 4:
			const genderOptions = document.getElementsByName("gender");
			let isAnyChecked = false;

			for (i = 0; i < genderOptions.length; i++) {
				if (genderOptions[i].checked) {
					isAnyChecked = true;
					userData["gender"] = genderOptions[i].value;
					break;
				}
			}

			if (!isAnyChecked) {
				alert("Please Select Gender");
				return;
			}

			const datePickerInput = document.getElementById("birthdate");
			let selectedDate = datePickerInput.value;

			if (!isValidDate(selectedDate)) {
				alert("Please Select Date");
				return;
			}

			let age = getAge(selectedDate);

			if (age < 18) {
				alert("Age should be greater than 18 to use Fitness First App");
				return;
			}

			userData["dob"] = selectedDate;
			userData["age"] = age;

			const country = document.getElementById("country");
			const value = country.value;

			if (value == "0") {
				alert("Please Select Country");
				return;
			}
			userData["country"] = value;
			userData["zipCode"] = document.getElementById("zip").value;
			break;

		case 5:
			let inputs = [];
			if (currentHeightUnit == "feet/inches") {
				inputs.push(document.getElementById("feet"));
				inputs.push(document.getElementById("inches"));
			} else {
				inputs.push(document.getElementById("centi"));
			}

			if (currentWeightUnit == "lbs") {
				inputs.push(document.getElementById("lbs"));
				inputs.push(document.getElementById("glbs"));
			} else {
				inputs.push(document.getElementById("kg"));
				inputs.push(document.getElementById("gkg"));
			}

			// Check for empty input
			for (const i of inputs) {
				if (i.value == "") {
					alert(`Please fill the ${i.getAttribute("placeholder")} section.`);
					return;
				}
			}

			// goal weight validation
			const curWeight = Number(inputs[inputs.length - 2].value);
			const goalWeight = Number(inputs[inputs.length - 1].value);
			let goal;
			for (i = 0; i < 3; i++) {
				const properties = getComputedStyle(goals[i]);
				if (properties["color"] == "rgb(255, 71, 57)") {
					goal = goals[i].innerHTML;
					break;
				}
			}

			console.log(goal);

			if (goal == "Lose Weight" && !(curWeight > goalWeight)) {
				alert(
					`This goal weight isn't compatible with your initial goal selection of ${goal}. Please enter a valid goal weight or select a different goal.`
				);
				return;
			} else if (goal == "Gain Weight" && !(curWeight < goalWeight)) {
				alert(
					`This goal weight isn't compatible with your initial goal selection of ${goal}. Please enter a valid goal weight or select a different goal.`
				);
				return;
			}

			userData["heightUnit"] = currentHeightUnit;
			userData["weightUnit"] = currentWeightUnit;
			if (currentHeightUnit == "feet/inches") {
				userData["heightFt"] = inputs[0].value;
				userData["heightInches"] = inputs[1].value;
				userData["heightCenti"] = heightToCentimeters(
					inputs[0].value,
					inputs[1].value
				);
			} else {
				userData["heightCenti"] = inputs[0].value;
				const { feet, inches } = centimetersToHeight(inputs[0].value);
				userData["heightFt"] = feet;
				userData["heightInches"] = inches;
			}

			if (currentWeightUnit == "lbs") {
				userData["weightLbs"] = inputs[inputs.length - 2].value;
				userData["goalWeightLbs"] = inputs[inputs.length - 1].value;
				userData["weightKg"] = poundsToKilograms(
					inputs[inputs.length - 2].value
				);
				userData["goalWeightKg"] = poundsToKilograms(
					inputs[inputs.length - 1].value
				);
			} else {
				userData["weightKg"] = inputs[inputs.length - 2].value;
				userData["goalWeightKg"] = inputs[inputs.length - 1].value;
				userData["weightLbs"] = kilogramsToPounds(
					inputs[inputs.length - 2].value
				);
				userData["goalWeightLbs"] = kilogramsToPounds(
					inputs[inputs.length - 1].value
				);
			}
			userData["WeightDiffKg"] = Math.abs(
				userData["goalWeightKg"] - userData["weightKg"]
			);
			userData["WeightDiffLbs"] = Math.abs(
				userData["goalWeightLbs"] - userData["weightLbs"]
			);
			break;
		case 6:
			const username = document.getElementById("username").value;
			const password = document.getElementById("password").value;

			await validateUsername();
			let uwarnmsg = document.querySelector(".uwarnmsg");
			const uproperties = getComputedStyle(uwarnmsg);
			if (uproperties["color"] == "rgb(255, 0, 0)") {
				return;
			}

			await validatePassword();
			let pwarnmsg = document.querySelector(".pwarnmsg");
			const pproperties = getComputedStyle(pwarnmsg);
			if (pproperties["color"] == "rgb(255, 0, 0)") {
				return;
			}

			userData["username"] = username;
			userData["password"] = password;

			userData["caloriesCalculated"] = await caloriesCalculation();
			await macrosCalculation(userData["caloriesCalculated"]);

			if (currentWeightUnit == "kg") {
				userData["targetWeeks"] = Math.round(userData["WeightDiffKg"] / 0.5);
			} else {
				userData["targetWeeks"] = Math.round(
					userData["WeightDiffLbs"] / 1.10231
				);
				console.log(userData["targetWeeks"]);
			}

			await createUser(userData);

			document.querySelector(".calorie-display").innerHTML =
				userData["caloriesCalculated"];

			let goalText = document.querySelector(".goalText");
			let weightDiff;
			if (currentWeightUnit == "kg") {
				weightDiff = userData["WeightDiffKg"];
			} else {
				weightDiff = userData["WeightDiffLbs"];
			}
			goalText.innerHTML = `${
				userData["goal1"].split(" ")[0]
			} ${weightDiff}${currentWeightUnit} by ${getMonthAndDateAfterWeeks(
				userData["targetWeeks"]
			)}`;
			break;
		default:
			break;
	}
	cards[currentCard++].style.display = "none";
	cards[currentCard].style.display = "flex";
	progressBar.style.width = `${12.5 * (currentCard + 1)}%`;
}

function getMonthAndDateAfterWeeks(weeks) {
	// Get the current date
	let currentDate = new Date();

	// Calculate the milliseconds in a week
	const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;

	// Calculate the future date
	let futureDate = new Date(currentDate.getTime() + weeks * millisecondsInWeek);

	// Get the month name in words
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	let futureMonth = monthNames[futureDate.getMonth()];

	// Get the day of the month
	let futureDay = String(futureDate.getDate()).padStart("2", 0);

	// Format the result as MMM DD
	let result = `${futureMonth} ${futureDay}`;

	return result;
}

async function createUser(userData) {
	const formData = new URLSearchParams();
	for (const [key, value] of Object.entries(userData)) {
		formData.append(key, value);
	}
	const result = await fetch("/createUser", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: formData,
	});
}

async function validateUsername() {
	const username = document.getElementById("username");
	let warnmsg = document.querySelector(".uwarnmsg");
	if (username.value == "") {
		warnmsg.innerHTML = "Enter Username";
		warnmsg.style.color = "red";
		warnmsg.style.display = "block";
		return;
	}
	const result = await fetch("/validateUser", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `username=${encodeURIComponent(username.value)}`,
	});

	if (result.ok) {
		const data = await result.json();
		if (data.isUnique) {
			warnmsg.innerHTML = "Unique Username";
			warnmsg.style.color = "green";
			warnmsg.style.display = "block";
		} else {
			warnmsg.innerHTML = "Username already taken";
			warnmsg.style.color = "red";
			warnmsg.style.display = "block";
		}
	} else {
		console.error("Error:", result.status);
	}
}

async function validatePassword() {
	const password = document.getElementById("password").value;
	let warnmsg = document.querySelector(".pwarnmsg");
	warnmsg.style.color = "red";

	if (password == "") {
		warnmsg.innerHTML = "Enter Password";
	} else if (password.length < 8) {
		warnmsg.innerHTML = " Password must be at least 8 characters";
	} else if (password.search(/[a-z]/) < 0) {
		warnmsg.innerHTML = "Password must contain at least one lowercase letter";
	} else if (password.search(/[A-Z]/) < 0) {
		warnmsg.innerHTML = "Password must contain at least one uppercase letter";
	} else if (password.search(/[0-9]/) < 0) {
		warnmsg.innerHTML = "Password must contain at least one number";
	} else {
		warnmsg.innerHTML = "Strong Password";
		warnmsg.style.color = "green";
	}
	warnmsg.style.display = "block";
}

function isValidDate(dateString) {
	// Check if the dateString is a valid date
	var regex = /^\d{4}-\d{2}-\d{2}$/;
	return regex.test(dateString);
}

function getAge(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

async function caloriesCalculation() {
	const result = await fetch("/calculateCalories", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `age=${encodeURIComponent(userData.age)}&gender=${encodeURIComponent(
			userData.gender
		)}&height=${encodeURIComponent(
			userData.heightCenti
		)}&weight=${encodeURIComponent(
			userData.weightKg
		)}&activityLevelValue=${encodeURIComponent(
			userData["activityLevelValue"]
		)}&goal=${encodeURIComponent(userData["goal1"])}`,
	});

	if (result.ok) {
		let data = await result.json();
		return data.calories;
	} else {
		console.error("Error:", result.status);
		return;
	}
}

async function macrosCalculation(dailyCalories) {
	const carbohydratePercentage = 50; // Example: 50% of total daily calories
	const proteinPercentage = 25; // Example: 25% of total daily calories
	const fatPercentage = 25; // Example: 25% of total daily calories

	// Calculate calorie amounts for each macronutrient
	const carbCalories = (carbohydratePercentage / 100) * dailyCalories;
	const proteinCalories = (proteinPercentage / 100) * dailyCalories;
	const fatCalories = (fatPercentage / 100) * dailyCalories;

	// Convert calorie amounts into grams
	userData.carbs = Math.round(carbCalories / 4); // 4 calories per gram of carbohydrate
	userData.protein = Math.round(proteinCalories / 4); // 4 calories per gram of protein
	userData.fat = Math.round(fatCalories / 9); // 9 calories per gram of fat
}

function showPrev() {
	cards[currentCard--].style.display = "none";
	cards[currentCard].style.display = "flex";
	progressBar.style.width = `${12.5 * (currentCard + 1)}%`;
}

function onOptionClick(i) {
	//deselecting logic
	const properties = getComputedStyle(goals[i]);
	if (properties["color"] == "rgb(255, 71, 57)") {
		goals[i].style.color = "#FFF";
		goals[i].style.borderColor = "#FFF";
		return;
	}

	if (i < 7) {
		// any one of first 3 logic
		if ([0, 1, 2].includes(i)) {
			const arr = [0, 1, 2];
			arr.splice(arr.indexOf(i), 1);
			for (const i of arr) {
				goals[i].style.color = "#FFF";
				goals[i].style.borderColor = "#FFF";
			}
		}

		// up to 3 logic
		let colorCount = 0;
		for (j = 0; j < 7; j++) {
			const properties = getComputedStyle(goals[j]);
			if (properties["color"] == "rgb(255, 71, 57)") {
				colorCount++;
			}
		}
		if (colorCount > 2) {
			return;
		}
	}

	if (i > 6 && i < 11) {
		// any one of four logic
		const arr = [7, 8, 9, 10];
		arr.splice(arr.indexOf(i), 1);
		for (const i of arr) {
			goals[i].style.color = "#FFF";
			goals[i].style.borderColor = "#FFF";
		}
	}

	// select logic
	if (!(properties["color"] == "rgb(255, 71, 57)")) {
		goals[i].style.color = "#FF4739";
		goals[i].style.borderColor = "#FF4739";
	}
}

function onHeightUnitChange(unitChangeText) {
	const feet = document.getElementById("feet");
	const inches = document.getElementById("inches");
	const centi = document.getElementById("centi");
	// const unitChangeText = document.querySelector('height-unit');
	if (currentHeightUnit == "feet/inches") {
		feet.style.display = "none";
		inches.style.display = "none";
		centi.style.display = "block";
		unitChangeText.innerHTML = "Change units to feet/inches";
		currentHeightUnit = "centimeters";
	} else {
		feet.style.display = "block";
		inches.style.display = "block";
		centi.style.display = "none";
		unitChangeText.innerHTML = "Change units to centimeters";
		currentHeightUnit = "feet/inches";
	}
}

function onWeightUnitChange(unitChangeText) {
	const lbs = document.getElementById("lbs");
	const kg = document.getElementById("kg");
	const glbs = document.getElementById("glbs");
	const gkg = document.getElementById("gkg");
	// const unitChangeText = document.querySelector('weight-unit');
	if (currentWeightUnit == "lbs") {
		lbs.style.display = "none";
		glbs.style.display = "none";
		kg.style.display = "block";
		gkg.style.display = "block";
		unitChangeText.innerHTML = "Change units to lbs";
		currentWeightUnit = "kg";
	} else {
		lbs.style.display = "block";
		glbs.style.display = "block";
		kg.style.display = "none";
		gkg.style.display = "none";
		unitChangeText.innerHTML = "Change units to kilograms";
		currentWeightUnit = "lbs";
	}
}

function heightToCentimeters(feet, inches) {
	// 1 foot = 30.48 centimeters
	// 1 inch = 2.54 centimeters
	const centimeters = feet * 30.48 + inches * 2.54;
	return centimeters;
}

function centimetersToHeight(centimeters) {
	// 1 foot = 30.48 centimeters
	// 1 inch = 2.54 centimeters

	// Convert centimeters to feet
	const feet = Math.floor(centimeters / 30.48);

	// Calculate remaining centimeters after converting to feet
	const remainingCentimeters = centimeters - feet * 30.48;

	// Convert remaining centimeters to inches
	const inches = Math.round(remainingCentimeters / 2.54);

	return { feet, inches };
}

function poundsToKilograms(pounds) {
	// 1 pound = 0.453592 kilograms
	const kilograms = pounds * 0.453592;
	return kilograms;
}

function kilogramsToPounds(kilograms) {
	// 1 kilogram = 2.20462 pounds
	const pounds = kilograms * 2.20462;
	return pounds;
}

async function goToDashboard(event) {
	event.preventDefault();
	document.getElementById("hiddenuser").value = userData.username;
	event.target.submit();
}
