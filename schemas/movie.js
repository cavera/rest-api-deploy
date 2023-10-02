const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }),
  year: z.number().int().min(1900).max(2024, {
    message: 'Year must be between 1900 and 2024',
    invalid_type_error: 'Year must be a number',
    required_error: 'Year is required',
  }),

  director: z.string({
    required_error: 'Director is required',
    invalid_type_error: 'Director must be a string',
  }),
  duration: z.number().int().positive({
    message: 'Duration must be a positive number',
    invalid_type_error: 'Duration must be a number',
    required_error: 'Duration is required',
  }),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
    invalid_type_error: 'Poster must be a string',
    required_error: 'Poster is required',
  }),
  rate: z.number().min(0).max(10).default(5.2),
  genre: z.array(z.enum(['Adventure', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Fantasy', 'Sci-Fi', 'Crime']), {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be an array of enum Genre',
  }),
})

function validateMovie(object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie,
}
