import fs from "node:fs/promises";
import { randomUUID } from "node:crypto"; 

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {

    let tasks = this.#database[table] ?? []

    if (search) {
      search = search.toLowerCase()
      console.log(search)
      tasks = tasks.filter(item => {
        return item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search)
      })
    } 

    return tasks
  }

  insert(table, data) {
    const { title, description } = data

    const task = {
      id: randomUUID(),
      title,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      completed_at: null
    }

    if (this.#database[table]) {
      this.#database[table].push(task)
    } else {
      this.#database[table] = [task]
    }

    this.#persist()
  }

  update(table, id, data) {
    if (!Array.isArray(this.#database[table])) return

    const { title, description } = data

    const rowIndex = this.#database[table].findIndex(row => {return row.id === id})

    if(rowIndex === -1) return false

    const task = this.#database[table][rowIndex]

    if (title) task.title = title
    if (description) task.description = description
    task.updated_at = new Date()

    this.#database[table][rowIndex] = task

    this.#persist()

    return true
  }

  toggleComplete(table, id) {
    if (!Array.isArray(this.#database[table])) return

    const tasks = this.#database[table]

    const rowIndex = tasks.findIndex(row => { return row.id === id})

    if(rowIndex === -1) return false

    let task = tasks[rowIndex]

    if(task.completed_at) { 
      task.completed_at = null 
    } else { 
      task.completed_at = new Date() 
    }

    this.#database[table][rowIndex] = task

    this.#persist()

    return true
  }

  delete(table, id) {
    if (!Array.isArray(this.#database[table])) return

    const tasks = this.#database[table]

    const rowIndex = tasks.findIndex(row => { return row.id === id})

    if(rowIndex === -1) return false

    this.#database[table].splice(rowIndex, 1)

    this.#persist()

    return true

  }

   

}