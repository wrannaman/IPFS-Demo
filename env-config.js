const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'process.env.BACKEND_URL': 'http://localhost:3020/api/shows'
}
