import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, getDocs, limit, query, where, startAfter } from '@angular/fire/firestore';
import { InfiniteScrollCustomEvent } from '@ionic/angular';




@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.page.html',
  styleUrls: ['./cliente-list.page.scss'],
})
export class ClienteListPage implements OnInit {

  constructor(private readonly firestore: Firestore) { 
    
  }

  listaClientes = new Array();
  isSearch: boolean = false;
  query = "";
  lastVisible: any = null;
  li = 10;
  results: any[] = [];
 
 
  
  ngOnInit() {
    console.log("ngOnInit");
    this.listaClientes = new Array();
    this.lastVisible = null;
    this.listarClientes();
  }

  ionViewWillEnter() {
    console.log("Registro Actualizado")
    this.listaClientes = [];
    this.lastVisible = null;
    this.listarClientes();
  }

  

  
  
  listarClientesSinFiltro = () => {
   
    const clientesRef = collection(this.firestore, 'cliente');
    let q;
  
    if (!this.lastVisible){
      q = query(clientesRef, limit(this.li));
    } else {
      q = query(clientesRef, limit(this.li), startAfter(this.lastVisible));
    }
  
    getDocs(q).then(re => {
      if (!re.empty) {
        this.lastVisible = re.docs[re.docs.length - 1];
        re.forEach(doc => {
          let cliente: any = doc.data();
          cliente.id = doc.id;
  
        
  
          this.listaClientes.push(cliente);
        });
      }
    });
  }
  

  listarClientes = () => {
    console.log("listar clientes");
    const clientesRef = collection(this.firestore, 'cliente');
  
    if ((this.query + "").length > 0) {
      let q = undefined;
      if (this.lastVisible) {
        q = query(clientesRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li),
          startAfter(this.lastVisible));
      } else {
        q = query(clientesRef,
          where("nombre", ">=", this.query.toUpperCase()),
          where("nombre", "<=", this.query.toLowerCase() + '\uf8ff'),
          limit(this.li));
      }
  
      getDocs(q).then(re => {
        if (!re.empty) {
          // Retirar lo que no corresponde
          let nuevoArray = new Array();
          for (let i = 0; i < re.docs.length; i++) {
            const doc: any = re.docs[i].data();
  
            if (doc.nombre.toUpperCase().startsWith(this.query.toUpperCase().charAt(0))) {
              nuevoArray.push(re.docs[i]);
            }
          }
  
          this.lastVisible = re.docs[nuevoArray.length - 1];
          for (let i = 0; i < nuevoArray.length; i++) {
            const doc: any = nuevoArray[i];
            let cliente: any = doc.data();
            cliente.id = doc.id;
  
  
            this.listaClientes.push(cliente);
          }
        }
      });
    } else {
      this.listarClientesSinFiltro();
    }
  }
  
  

onIonInfinite(ev: any) {
  this.listarClientes();
  setTimeout(() => {
    (ev as InfiniteScrollCustomEvent).target.complete();
  }, 500);
}


  clickSearch = () => {
    this.isSearch = true;
  }

  clearSearch = () => {
    this.isSearch = false;
    this.query = "";

    this.listaClientes = new Array();
    this.lastVisible = null;
    this.listarClientes();
  }

  buscarSearch = (e:any) => {
    this.isSearch = false;
    this.query = e.target.value;

    this.listaClientes = new Array();
    this.lastVisible = null;
    this.listarClientes();

  }

  


}
