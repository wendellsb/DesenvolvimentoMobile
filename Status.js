"use strict";

export default class Status {
  #titulo;
  static NAVEGANDO = new Status('Navegando');
  static INCLUINDO = new Status('Incluindo');  
  static ALTERANDO = new Status('Alterando');  
  static EXCLUINDO = new Status('Excluindo');  
  
  constructor(titulo) {
    this.#titulo = titulo;
  }  
}