import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'

import { User, Auth, Group } from './app/routes'
import Db from './config/db'
config()

class App {
  public express: express.Application
  private readonly access_url = process.env.ACCESS_URL ?? 'http://localhost:3001'

  public constructor () {
    Db.connectDb()
    this.express = express()
    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(cors({ origin: this.access_url }))
    this.express.use(helmet())
    this.express.use(morgan('dev'))
    this.express.use(express.json())
  }

  private routes (): void {
    this.express.use('/api', User)
    this.express.use('/api', Auth)
    this.express.use('/api', Group)
  }
}

export default new App().express
