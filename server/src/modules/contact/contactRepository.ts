import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Contact = {
  id: number;
  user_id: number;
  firstname: string;
  lastname: string;
  mail: string;
  address: string;
  phone_number: string;
  photo_url: string | null;
};

class ContactRepository {
  async create(contact: Omit<Contact, "id">) {
    const [result] = await databaseClient.execute<Result>(
      `INSERT INTO address_book (user_id, firstname, lastname, mail, address, phone_number, photo_url)
                VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        contact.user_id,
        contact.firstname,
        contact.lastname,
        contact.mail,
        contact.address,
        contact.phone_number,
        contact.photo_url,
      ],
    );
    return result.insertId;
  }
  async read(id: number) {
    const [rows] = await databaseClient.execute<Rows>(
      `SELECT * FROM address_book 
            WHERE id = ?`,
      [id],
    );
    return rows[0] as Contact;
  }
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * 
            FROM address_book`,
    );
    return rows as Contact[];
  }
  async update(contact: Contact) {
    const [rows] = await databaseClient.execute<Result>(
      `UPDATE address_book 
            SET firstname = ?, lastname = ?, mail = ?, address = ?, phone_number = ?, photo_url = ?
            WHERE id = ?`,
      [
        contact.firstname,
        contact.lastname,
        contact.mail,
        contact.address,
        contact.phone_number,
        contact.photo_url,
        contact.id,
      ],
    );
    return rows.affectedRows;
  }
  async delete(contactId: number) {
    const [rows] = await databaseClient.execute<Result>(
      `DELETE FROM address_book 
            WHERE id = ?`,
      [contactId],
    );
    return rows.affectedRows;
  }
}
export default new ContactRepository();
