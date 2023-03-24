import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js";
const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks', req?.query?.search)
      
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      database.insert('tasks', {title, description})

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const data = req.body

      const result = database.update('tasks', id, data)

      return result ? res.writeHead(204).end() : res.writeHead(406).end(JSON.stringify('Invalid ID'))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.toggleComplete('tasks', id)

      return result ? res.writeHead(204).end() : res.writeHead(406).end(JSON.stringify('Invalid ID'))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.delete('tasks', id)

      return result ? res.writeHead(204).end() : res.writeHead(406).end(JSON.stringify('Invalid ID'))
    }
  }

]