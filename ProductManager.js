const fs = require("fs").promises;

class Contenedor {
  constructor(file) {
    this.file = file;
  }
  g;

  async save(title, price, thumbnail) {
    try {
      //Obtengo array con los objetos
      const objects = await this.getAll();
      //Obtengo Id del último objeto
      const lastId = objects.length > 0 ? objects[objects.length - 1].id : 0;
      //Creamos el ID al nuevo objeto en base al último.
      const newId = lastId + 1;
      //Creamos el nuevo objeto con los parámetros recibidos
      const newObj = {
        id: newId,
        title,
        price,
        thumbnail,
      };
      //Sumamos el nuevo objeto al array
      objects.push(newObj);
      //Lo guardamos en el archivo
      await this.saveObjects(objects);
      //Retornamos el nuevo ID creado
      return newId;
    } catch (error) {
      throw new Error("Error al guardar el objeto");
    }
  }

  async getById(id_obj) {
    try {
      //Obtenemos el array con los objetos
      const objects = await this.getAll();
      //Buscamos el objeto cuyo ID coincida con el ID recibido por parámetro.
      const foundById = objects.find((obj) => obj.id === id_obj);
      return foundById || null;
    } catch (error) {
      throw new Error("Error al obtener objeto por Id.");
    }
  }

  async getAll() {
    try {
      //Obtenemos la información del archivo pasado por parámetro al constructor
      const data = await fs.readFile(this.file, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  async deleteById(id_obj) {
    try {
      //Obtenemos el array con los objetos
      let objects = await this.getAll();
      //Modificamos el array original eliminando el objeto indicado por parámetro.
      objects = objects.filter((obj) => obj.id !== id_obj);
      //Actualizamos el array en el archivo
      await this.saveObjects(objects);
    } catch (error) {
      throw new Error("Error al eliminar el objeto.");
    }
  }

  async deleteAll() {
    try {
      //Vaciamos el archivo.
      await this.saveObjects([]);
    } catch (error) {
      throw new Error("Error al eliminar los objetos.");
    }
  }

  async saveObjects(objects) {
    try {
      await fs.writeFile(this.file, JSON.stringify(objects, null, 2));
    } catch (error) {
      throw new Error("Error al guardar objetos.");
    }
  }
}

//EJECUCIÓN (Descomentar para probar los métodos)
const main = async () => {
  const products = new Contenedor("productos.txt");

  // //Guardar un objeto
  // console.log("Objeto guardado con ID: ",await products.save("Producto A", 1000, "urlImage"));
  // console.log("Objeto guardado con ID: ",await products.save("Producto B", 2000, "urlImage"));
  // console.log("Objeto guardado con ID: ",await products.save("Producto C", 3000, "urlImage"));

  // //Obtener todos los objetos
  // console.log(await products.getAll());

  // //Obtener objeto por ID
  // const byId = await products.getById(2)
  // console.log(byId);

  // // Eliminar todos los objetos.
  // await products.deleteAll()
  // console.log(await products.getAll());

  // //Eliminar objeto por ID
  // await products.deleteById(2)
  // console.log("Objeto eliminado");
  // console.log(await products.getAll());
};

main().catch((error) => console.error(error));
