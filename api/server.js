import app from "./src/app.js";

const _PORT = 3000

app.listen(_PORT, (err) => {
  if (err) {
    console.log(`error: ${err}`)
  }

  console.log(`Applicatio listening on http://localhost:${_PORT}`)
})