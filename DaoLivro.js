"use strict";

import ModelError from "/ModelError.js";
import Livro from "/Livro.js";

export default class DaoLivro {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayLivros = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoLivro.conexao == null) {
      DaoLivro.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("LivroDB", 1); 

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("LivroST", {
            autoIncrement: true
          });
          store.createIndex("idxId", "id", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoLivro.conexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterLivros() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["LivroST"], "readonly");
        store = transacao.objectStore("LivroST");
        indice = store.index('idxId');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Livro.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayLivros = await promessa;
    return this.arrayLivros;
  }

  //-----------------------------------------------------------------------------------------//

  async obterLivroPelaId(id) {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["LivroST"], "readonly");
        store = transacao.objectStore("LivroST");
        indice = store.index('idxId');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(id);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Livro.assign(consulta.result)); 
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let livro = await promessa;
    return livro;
  }

  //-----------------------------------------------------------------------------------------//

  async obterLivrosPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["LivroST"], "readonly");
        store = transacao.objectStore("LivroST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Livro.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayLivros = await promessa;
    return this.arrayLivros;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(livro) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["LivroST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o Livro", event.target.error));
      };
      let store = transacao.objectStore("LivroST");
      let requisicao = store.add(Livro.deassign(livro));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(livro) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["LivroST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o Livro", event.target.error));
      };
      let store = transacao.objectStore("LivroST");     
      let indice = store.index('idxId');
      var keyValue = IDBKeyRange.only(livro.getId());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.id == livro.getId()) {
            const request = cursor.update(Livro.deassign(livro));
            request.onsuccess = () => {
              console.log("[DaoLivro.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Livro com a id " + livro.getId() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(livro) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["LivroST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o Livro", event.target.error));
      };
      let store = transacao.objectStore("LivroST");
      let indice = store.index('idxId');
      var keyValue = IDBKeyRange.only(livro.getId());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.id == livro.getId()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Livro com a id " + livro.getId() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
