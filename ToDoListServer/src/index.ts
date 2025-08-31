import * as express from 'express'
import { Request, Response } from 'express'
import { AppDataSource } from "./data-source"
import { ToDoItem } from "./entity/ToDoItem"
import * as cors from 'cors'

interface CreateTodoRequest {
    name: string;
    description: string;
    status: string;
}

// Initialize express app
const app = express()
app.use(express.json())
app.use(cors())

// Initialize database connection
AppDataSource.initialize().then(async () => {
    // Define routes
    app.get("/todos", async (_req: Request, res: Response) => {
        try {
            const todos = await AppDataSource.manager.find(ToDoItem);
            res.json(todos)
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch todos" })
        }
    })

    app.post("/todos", async (req: Request<{}, {}, CreateTodoRequest>, res: Response) => {
        try {
            const todo = AppDataSource.manager.create(ToDoItem, req.body)
            const results = await AppDataSource.manager.save(todo)
            res.status(201).json(results)
        } catch (error) {
            res.status(500).json({ error: "Failed to create todo" })
        }
    })

    // Start express server
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })

}).catch(error => console.log(error))
