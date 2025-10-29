const form = document.getElementById("form");
const list = document.getElementById("list");

form.addEventListener("submit", async (e) => { //async is used so that we can use promises
  e.preventDefault(); //Prevents the page from reloading

  //Retrieves names and colors
  const name = document.getElementById("name").value; 
  const color = document.getElementById("color").value; 

  await fetch("/api/submit", { //Await pauses the function until the promise resolves, then returns the result. Fetch returns a promise.
    method: "POST", //Post means it is sending data
    headers: { "Content-Type": "application/json" }, //Tells the backend we are sending JSON data
    body: JSON.stringify({ name, color }), //Converts the JavaScript object into a JSON string so that the backend can read it
  });

  //Clears the name and input fields
  document.getElementById("name").value = ""; 
  document.getElementById("color").value = "";

  // Reload submissions
  loadSubmissions();

});

async function loadSubmissions() {
  const res = await fetch("/api/submissions");
  const data = await res.json();
  list.innerHTML = data
    .map(row => `<li><strong>${row.name}</strong> likes ${row.color}</li>`)
    .join("");
}
loadSubmissions();