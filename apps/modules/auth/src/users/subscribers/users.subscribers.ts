import * as bcrypt from 'bcrypt';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";

// entity
import { User } from "../entities/user.entity";


@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User
    }

    beforeInsert(event: InsertEvent<User>): void | Promise<any> {
        const user = event.entity;

        if (typeof user === 'object' && 'password' in user) {
            const hashedPassword = bcrypt.hashSync(user.password, 10)
            user.password = hashedPassword;
        }
    }
}