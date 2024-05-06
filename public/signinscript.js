async function validatePassword(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Username and password fields cannot be empty');
    return false; // Prevent form submission
  }

  try {
    const response = await fetch('/validatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    });

    if (response.ok) {
      document.getElementById('hiddenuser').value = await response.json();
      event.target.submit();
      return true; // Allow form submission
    } else {
      alert('Invalid password or user not found');
      document.getElementById('password').value = '';
      return false; // Prevent form submission
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while validating the password');
    return false; // Prevent form submission
  }
}

async function signUpSubmit(){
  document.getElementById("signupsubmitbtn").click();
}
