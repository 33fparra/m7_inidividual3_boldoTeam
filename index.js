import pkg from 'pg';  //no me funciono cono el { Pool } decia que era de la version CommonJs 
const { Pool } = pkg;

// 1. Realizar la conexión con Base de Datos
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'pipe1234',
  database: 'individual2',
  port: 5432,
});

async function agregarUsuario(id, nombre) {
  const consulta = {
    text: "INSERT INTO usuarios (id, nombre) VALUES ($1, $2) RETURNING *",
    values: [id, nombre]
  }
  const response = await pool.query(consulta);
  console.log('Usuario', nombre, 'agregado con éxito');
  return response.rows;
}
//probada que funciona

async function modificarUsuario(id, nombre) {
  const consulta = {
    text: "UPDATE usuarios SET nombre = $2 WHERE id = $1 RETURNING *",
    values: [id, nombre]
  }
  const response = await pool.query(consulta);
  console.log('Usuario con id', id, 'modificado con éxito');
  return response.rows;
}
//probada que funciona

async function eliminarUsuario(id) {
  const consulta = {
    text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    values: [id]
  }
  const response = await pool.query(consulta);
  console.log('Usuario con id', id, 'eliminado con éxito');
  return response.rows;
}
//probada que funciona

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  //aqui asigno los comandos para la terminal
  const commands = {
    agregar: async () => await agregarUsuario(...args),
    modificar: async () => await modificarUsuario(...args),
    eliminar: async () => await eliminarUsuario(args[0]),
  };

  const executeCommand = commands[command];

  if (executeCommand) {
    await executeCommand();
  } else {
    console.log('Comando no reconocido');
  }

  await pool.end();
}

main().catch((error) => {
  console.error('Error en la aplicación', error);
});