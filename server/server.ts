import express from "express"

const app = express()

app.use(function (req, res, next) {
  setTimeout(next, 2000)
})

app.get("/", (req, res) => {
  res.send("Ok")
})

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001")
})
