import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("toDoItems")
export class ToDoItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: string;
}
