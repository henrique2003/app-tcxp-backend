import { connect } from 'mongoose'
import { config } from 'dotenv'
config()

class Db {
  private readonly mongo_url = process.env.MONGO_URL ?? 'mongodb://localhost:27017/app-viagem'

  public async connectDb (): Promise<void> {
    try {
      await connect(this.mongo_url, {
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
