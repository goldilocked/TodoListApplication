import express from 'express';
import { Request, Response } from 'express';
import { AppDataSource } from "./data-source";
import { ToDoItem } from "./entity/ToDoItem";
import cors from 'cors';

interface CreateTodoRequest {
    name: string;
    description: string;
    status: string;
    dueDate?: string | null;
}

function isValidDate(dateString: string | null | undefined): boolean {
    if (!dateString) return true; // null/undefined dates are valid
    const date = new Date(dateString);
    // TODO make a date service so that I can mock dates
    const today = new Date();
    return !isNaN(date.getTime()) && date >= today;
}

function isValidTodoRequest(req: any): req is CreateTodoRequest {
    const basicValidation = typeof req.name === 'string' && req.name.length > 0 &&
           typeof req.description === 'string' && req.description.length > 0 &&
           typeof req.status === 'string' && req.status.length > 0;
    
    // If dueDate is provided, validate it's not in the past
    if (req.dueDate && !isValidDate(req.dueDate)) {
        return false;
    }

    return basicValidation;
}

// Initialize express app
export const app = express();
app.use(express.json());
app.use(cors());

// Define routes
app.get("/todos", async (_req: Request, res: Response) => {
    try {
        const todos = await AppDataSource.manager.find(ToDoItem);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

app.post("/todos", async (req: Request, res: Response) => {
    try {
        if (!isValidTodoRequest(req.body)) {
            return res.status(400).json({ 
                error: req.body.dueDate && !isValidDate(req.body.dueDate) 
                    ? "Due date cannot be in the past" 
                    : "Missing required fields" 
            });
        }

        const todo = AppDataSource.manager.create(ToDoItem, req.body);
        const results = await AppDataSource.manager.save(todo);
        res.status(201).json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to create todo" });
    }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        if (!isValidTodoRequest(req.body)) {
            return res.status(400).json({ 
                // TODO return validation from my error checker instead
                error: req.body.dueDate && !isValidDate(req.body.dueDate) 
                    ? "Due date cannot be in the past" 
                    : "Missing required fields" 
            });
        }

        const todo = await AppDataSource.manager.findOne(ToDoItem, { where: { id } });
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        // Update the todo with new values
        AppDataSource.manager.merge(ToDoItem, todo, req.body);
        const results = await AppDataSource.manager.save(todo);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to update todo" });
    }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await AppDataSource.manager.delete(ToDoItem, id);
        
        if (result.affected === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

// Only start the server if this file is run directly
if (require.main === module) {
    // Initialize database connection
    AppDataSource.initialize().then(() => {
        // Start express server
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }).catch(error => console.log(error));
}
