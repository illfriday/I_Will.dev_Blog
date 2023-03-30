const fetch = require("node-fetch");

// function to get blogposts
async function addUser(username, email, password) {
  try {
    // initiate fetch
    const data = await fetch("http://localhost:1337/api/auth/local/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    // store the JSON response when promise resolves
    const response = await data.json();
    console.log(response);
    // handle CMS errors
    if (response.errors) {
      let errors = response.errors;
      errors.map((error) => {
        console.log(error.message);
      });
      throw new Error("Houston... We have a CMS problem");
    }
  } catch (error) {
    throw new Error(error);
  }
}

// export for 11ty
module.exports = addUser;
