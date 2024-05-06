async function fetchData(){
    const response = await fetch('/retriveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(parameterValue)}`,
    });

    if(response.ok){
        return await response.json();
    }else{
        alert("Something went wrong");
    }
}

async function main() {
    let userData = await fetchData();
    console.log(userData);
    document.querySelector(".usernameText").innerHTML = `${userData.username}`;
    document.querySelector(".proteinText").innerHTML = `${userData.protein} grams`;
    document.querySelector(".carbsText").innerHTML = `${userData.carbs} grams`;
    document.querySelector(".fatText").innerHTML = `${userData.fat} grams`;
    document.querySelector(".caloriesText").innerHTML = `${userData.caloriesCalculated} cal`;
    document.querySelector(".goalText").innerHTML = `${userData.goal1}`;
    // document.querySelector(".waterIntakeText").innerHTML = `${userData.waterIntake} glasses`;


    

}

main();