const { validateMovie } = require('./schemas/movie')

const movie = {
  title: 1,
  year: 'wow',
}

const validate = validateMovie(movie)

console.log(validate.error)
