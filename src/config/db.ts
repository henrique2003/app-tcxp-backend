import { connect } from 'mongoose'
import { config } from 'dotenv'
config()

class Db {
  public async connectDb (): Promise<void> {
    try {
      await connect(process.env.MONGO_URL ?? '', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      console.log('MongoDb Connected...')
    } catch (err) {
      console.error(err.message)
      process.exit(1)
    }
  }
}

export default new Db()
