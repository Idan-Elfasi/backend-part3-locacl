import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import  { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// require("dotenv").config();



import { loggerService } from './services/logger.service.js'
loggerService.info('server.js loaded...')

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body


// if (process.env.NODE_ENV === 'production') {
  //   // Express serve static files on production environment
  //   app.use(express.static(path.resolve(__dirname, 'public')))
  //   console.log('__dirname: ', __dirname)
  // } else {
    const corsOptions = {
      origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ],
      credentials: true,
    }
    
    app.use(cors(corsOptions))//Can get axios requests from  A different port than the port the backend is on
    
    
import { toyRoutes } from './api/toy/toy.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

//routs 
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)



// Fallback

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

// Listen will always be the last line in our server!
const port = process.env.PORT || 3032
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
