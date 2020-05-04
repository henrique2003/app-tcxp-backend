import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { Auth } from './app/routes'

class App {
  public express: express.Application

  public constructor () {
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
    this.express.use('/api', Auth)
  }
}

export default new App().express
