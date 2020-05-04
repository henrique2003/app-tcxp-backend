import app from './App'
const port = 3001 || process.env.PORT

app.listen(port, () => {
  console.log('Api running')
})
