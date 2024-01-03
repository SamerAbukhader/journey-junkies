import mysql from "mysql";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "journyjunkies.ddns.net",
  user: "JJDB",
  password: "HOp5PaViSef3q1f27IzaPoKe2an4nA",
  database: "journy_junkies",
});
export default pool;
