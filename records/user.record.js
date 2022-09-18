const {pool} = require("../utils/db");
const {ValidationError, handleError} = require("../utils/errors");
const {v4: uuid} = require("uuid");

class UserRecord {

    constructor(obj) {
        const {id, firstName, lastName, email, role} = obj;

        if (!firstName || firstName.length < 3 || firstName.length > 55) {
            throw new ValidationError('First name must be between 3 and 55 characters long.')
        }

        if (!email || typeof email !== 'string' || email.indexOf('@') === -1) {
            throw new ValidationError('Invalid e-mail.')
        }

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;

    }

    async insert() {
        const [result] = await pool.execute("INSERT INTO `users`(`firstName`, `lastName`, `email`, `role`) VALUES (:firstName, :lastName, :email, :role);", {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
        });

        this.id = result.insertId;
        return result.insertId;
    }

    static async listAll() {
        const [results] = await pool.execute("SELECT * FROM `users` ORDER BY `firstName` ASC");
        return results.map(obj => new UserRecord(obj));
    }

    static async listAllWithRole(role) {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `role` = :role ORDER BY `firstName` ASC", {
            role,
        });
        return results.map(obj => new UserRecord(obj));
    }

    static async getOne(id) {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        });
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async update() {

        await pool.execute("UPDATE `users` SET `firstName` = :firstName, `lastName` = :lastName, `email` = :email, `role` = :role WHERE `id` = :id", {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
        });

    }

    async delete() {
        if (!this.id) {
            throw new ValidationError();
        }

        await pool.execute('DELETE FROM `users` WHERE `id` = :id', {
            id: this.id,
        });
        return true;
    }
}

module.exports = {
    UserRecord,
};