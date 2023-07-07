import axios from "axios"
import express from "express"
import CircuitBreaker from "opossum"

const app = express()

// Endpoint para consulta na API externa
app.get("/", (req, res) => {
  const circuitBreakerOptions = {
    timeout: 3000, // Tempo limite para uma solicitação antes de acionar o fallback
    errorThresholdPercentage: 50, // Porcentagem de erros antes de acionar o fallback
    resetTimeout: 10000 // Tempo de espera antes de tentar reabrir o circuito
  }

  function asyncFunctionThatCouldFail() {
    return axios.get("http://localhost:3001")
  }

  const circuitBreaker = new CircuitBreaker(
    asyncFunctionThatCouldFail,
    circuitBreakerOptions
  )

  circuitBreaker
    .on("close", () => console.log("CLOSE"))
    .on("open", () => console.log("OPEN"))
    .on("fallback", (data) => console.log("FALLBACK"))
    .on("halfOpen", (data) => console.log("HALF"))
    .on("success", () => console.log("SUCCESS"))
    .fallback(() => res.send("Fallback"))
    .fire()
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      res.status(500).send(error.message)
    })
})

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080!")
})
