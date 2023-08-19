import axios from "axios"
import express from "express"
import CircuitBreaker from "opossum"
import { createClient } from "redis"

const app = express()
const redisClient = createClient()
const redisTTL = 1 * 60 //one minute
const cacheKey = "api-response"

redisClient.on("error", (err) => console.log("Redis Client Error", err))
redisClient.connect()

const circuitBreakerOptions = {
  timeout: 3000, // Timeout to call fallback Tempo limite para uma solicitação antes de acionar o fallback
  errorThresholdPercentage: 50, // Porcentagem de erros antes de acionar o fallback
  resetTimeout: 10000 // Tempo de espera antes de tentar reabrir o circuito
}

async function asyncHttpCall() {
  const cacheResponse = await redisClient.get(cacheKey)

  if (cacheResponse) return JSON.parse(cacheResponse)

  const response = await axios.get("http://localhost:3001")

  await redisClient.set(cacheKey, JSON.stringify(response.data), {
    EX: redisTTL, //expire time, in seconds.
    NX: true //only set the key if it does not already exist
  })

  return response.data
}

const circuitBreaker = new CircuitBreaker(asyncHttpCall, circuitBreakerOptions)

circuitBreaker
  .on("close", () => console.log("CLOSE"))
  .on("open", () => console.log("OPEN"))
  .on("halfOpen", () => console.log("HALF"))
  .on("success", () => console.log("SUCCESS"))
  .on("fallback", () => console.log("FALLBACK"))
  .fallback(() => {
    return { id: 1, title: "iphone", price: "2.000" } //default object to return on fallback, here we can adopt any strategy
  })

// External endpoint to call
app.get("/", async (req, res) => {
  const response = await circuitBreaker.fire()

  res.send(response)
})

app.listen(8080, () => {
  console.log("Server running at door 8080!")
})
