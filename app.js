const express = require('express')
const crypto = require('crypto')
const z = require('zod')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movie')
const cors = require('cors')

const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234', 'http://localhost:8081', 'http://movies.com']

const app = express()

app.disable('x-powered-by')
app.use(express.json())

app.use(
  cors({
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)

app.get('/', (request, response) => {
  response.json({ messsage: 'hello there' })
})

app.get('/movies', (request, response) => {
  // const origin = request.header('origin')

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   response.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = request.query

  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return response.json(filteredMovies)
  }

  response.json(movies)
})

app.get('/movies/:id', (request, response) => {
  const { id } = request.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return response.json(movie)

  response.status(404).json({ error: 'Movie not found' })
})

app.post('/movies', (request, response) => {
  const result = validateMovie(request.body)

  if (result.error) {
    throw response.status(400).json({ error: result?.error.issues })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }
  movies.push(newMovie)
  response.status(201).json(newMovie)
})

app.patch('/movies/:id', (request, response) => {
  const result = validatePartialMovie(request.body)

  if (!result.success) {
    return response.status(400).json({ error: result?.error.issues })
  }

  const { id } = request.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return response.status(404).json({ message: 'Movie not found' })

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  }

  movies[movieIndex] = updatedMovie

  return response.json(updatedMovie)
})

//delete movie
app.delete('/movies/:id', (request, response) => {
  // const origin = request.header('origin')

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   response.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = request.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return response.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)
  return response.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT ?? 8000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
