import ModelError from "/ModelError.js";

export default class Livro {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #id;
  #ano;
  #titulo;
  #autor;
  #assunto;

  //-----------------------------------------------------------------------------------------//

  constructor(id, ano, titulo, autor, assunto) {
    this.setId(id);
    this.setAno(ano);
    this.setTitulo(titulo);
    this.setAutor(autor);
    this.setAssunto(assunto);      
  }
  
  //-----------------------------------------------------------------------------------------//

  getId() {
    return this.#id;
  }
  
  //-----------------------------------------------------------------------------------------//

  setId(id) {
    if(!Livro.validarId(id))
      throw new ModelError("Id Inválido: " + id);
    this.#id = id;
  }
  
  //-----------------------------------------------------------------------------------------//

  getAno() {
    return this.#ano;
  }
  
  //-----------------------------------------------------------------------------------------//

  setAno(ano) {
    if(!Livro.validarAno(ano))
      throw new ModelError("Ano Inválido: " + ano);
    this.#ano = ano;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTitulo() {
    return this.#titulo;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTitulo(titulo) {
    if(!Livro.validarTitulo(titulo))
      throw new ModelError("Titulo Inválido: " + titulo);
    this.#titulo = titulo;
  }
  
  //-----------------------------------------------------------------------------------------//

  getAutor() {
    return this.#autor;
  }
  
  //-----------------------------------------------------------------------------------------//

  setAutor(autor) {
    if(!Livro.validarAutor(autor))
      throw new ModelError("Autor inválido: " + autor);
    this.#autor = autor;
  }
  
  //-----------------------------------------------------------------------------------------//

  getAssunto() {
    return this.#assunto;
  }
  
  //-----------------------------------------------------------------------------------------//

  setAssunto(assunto) {
    if(!Livro.validarAssunto(assunto))
      throw new ModelError("Assunto inválido: " + assunto);
    this.#assunto = assunto;
  }
  
  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"id" : "' + this.#id + '",' +
               '"ano" :  "' + this.#ano + '",' +
               '"titulo" : "' + this.#titulo + '",' +
               '"autor" : "' + this.#autor + '",' +
               '"assunto" : "' + this.#assunto + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Livro(obj.id, obj.ano, obj.titulo, obj.autor, obj.assunto);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarId(id) {
    if(id == null || id == "" || id == undefined)
      return false;
    const padraoId = /[0-9]/;
    if (!padraoId.test(id))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarAno(ano) {
      if(ano == null || ano == "" || ano == undefined)
        return false;
      const padraoAno = /[0-9]/;
      if (!padraoAno.test(ano))
        return false;
      return true;
    }

  //-----------------------------------------------------------------------------------------//

  static validarTitulo(titulo) {
    if(titulo == null || titulo == "" || titulo == undefined)
      return false;
    if (titulo.length > 40) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarAutor(autor) {
    if(autor == null || autor == "" || autor == undefined)
      return false;
    if (autor.length > 40) 
      return false;
    const padraoAutor = /[A-Z][a-z] */;
    if (!padraoAutor.test(autor)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarAssunto(assunto) {
    if(assunto == null || assunto == "" || assunto == undefined)
      return false;
    if (assunto.length > 40) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Id: " + this.id + "\n";
    texto += "Titulo: " + this.titulo + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}