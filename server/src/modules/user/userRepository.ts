import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  lastname: string;
  firstname: string;
  mail: string;
  password: string;
};

class UserRepository {
  async create(user: Omit<User, "id">) {
    try {
      const [result] = await databaseClient.execute<Result>(
        `INSERT INTO user (firstname, lastname, mail, password)
				VALUES(?, ?, ?, ?)`,
        [user.firstname, user.lastname, user.mail, user.password],
      );
      return result.insertId;
    } catch (err) {
      throw new Error("Error when creating the user");
    }
  }

  async read(id: number) {
    try {
      const [rows] = await databaseClient.execute<Rows>(
        `SELECT lastname, firstname, mail 
                FROM user WHERE id = ?`,
        [id],
      );
      return rows[0] as User;
    } catch (err) {
      throw new Error("Error while reading porperties of the user");
    }
  }

  async readAll() {
    try {
      const [rows] = await databaseClient.query<Rows>(
        `SELECT lastname, firstname, mail
                 FROM user`,
      );
      return rows as User[];
    } catch (err) {
      throw new Error("Error");
    }
  }

  async update(user: User) {
    try {
      const [rows] = await databaseClient.execute<Result>(
        `UPDATE user
				SET firstname = ?, lastname = ?, mail = ?, password = ?
				WHERE id = ?`,
        [user.firstname, user.lastname, user.mail, user.password, user.id],
      );
      return rows.affectedRows;
    } catch (err) {
      throw new Error("Error on user update");
    }
  }

  async delete(userId: number) {
    try {
      const [rows] = await databaseClient.execute<Result>(
        `DELETE FROM user 
                WHERE id = ?`,
        [userId],
      );
      return rows.affectedRows;
    } catch (err) {
      throw new Error("Error while deleting user");
    }
  }
  async readByEmail(mail: string) {
    const [rows] = await databaseClient.execute<Rows>(
      `SELECT * FROM user 
           WHERE mail = ?`,
      [mail],
    );
    return rows[0] as User;
  }
}

export default new UserRepository();
