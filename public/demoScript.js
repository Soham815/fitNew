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
    console.log(userData)
}

main();