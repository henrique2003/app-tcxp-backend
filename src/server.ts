import app from './app'
const port = 3001 || process.env.PORT

app.listen(port, () => {
  console.log('Api running')
})

// "test": "jest --passWithNoTests --silent --noStackTrace --runInBand",
// "test:verbose": "jest --passWithNoTests --runInBand",
// "test:integration": "npm test -- --watchAll",
// "test:staged": "npm test",
// "test:ci": "npm test -- --coverage",
// , "npm run test:staged"
