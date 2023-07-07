import axios from "axios"
import express from "express"
import CircuitBreaker from "opossum"
import { createClient } from "redis"

const app = express()
const redisClient = createClient()
const cacheKey = "api-response"

redisClient.on("error", (err) => console.log("Redis Client Error", err))
redisClient.connect()

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
  .on("halfOpen", () => console.log("HALF"))
  .on("success", () => console.log("SUCCESS"))

// Endpoint para consulta na API externa
app.get("/", async (req, res) => {
  circuitBreaker
    .fallback(async () => {
      console.log("FALLBACK")
      const data = await redisClient.get(cacheKey)

      if (!data) throw new Error("Erro Interno")

      return JSON.parse(data)
    })
    .fire()
    .then((response) => {
      let result = response
      if (response.data) {
        result = response.data
        redisClient.set(cacheKey, JSON.stringify(response.data))
      }
      res.send(result)
    })
    .catch((error) => {
      res.status(500).send(error.message)
    })
})

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080!")
})
