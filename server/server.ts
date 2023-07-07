import express from "express"

const app = express()

app.use(function (req, res, next) {
  setTimeout(next, 2000)
})

app.get("/", (req, res) => {
  const product = {
    id: 1,
    title: "iphone",
    price: "1.999"
  }
  res.send(JSON.stringify(product))
})

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001")
})
