const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const low = require('lowdb')
const db = low('db.json')
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router


// Use default router
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})