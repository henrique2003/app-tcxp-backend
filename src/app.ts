import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { User, Auth, Groups } from './app/routes'
import Db from './config/db'

class App {
  public express: express.Application

  public constructor () {
    Db.connectDb()
    this.express = express()
    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(express.json())
  }

  private routes (): void {
    this.express.use('/api', User)
    this.express.use('/api', Auth)
    this.express.use('/api', Groups)
  }
}

export default new App().express
