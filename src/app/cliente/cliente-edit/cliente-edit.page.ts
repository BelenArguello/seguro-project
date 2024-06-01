import { Component, OnInit } from '@angular/core';
import { collection, addDoc, updateDoc, Firestore, doc, getDoc, deleteDoc, Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.page.html',
  styleUrls: ['./cliente-edit.page.scss'],
})
export class ClienteEditPage implements OnInit {
  id: any; //atributo que recibe el id del registro desde la ruta
  isNew: boolean = false;
  cliente: any = {};

  constructor(
    private readonly firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      console.log("params", params);
      this.id = params.id;
      if (params.id == 'new') {
        this.isNew = true;
      } else {
        this.obtenerCliente(this.id);
      }
    });
  }

  nuevoCliente = () => {
    this.cliente = {};
    this.router.navigate(["/cliente-edit/new"])
  }

  editarCliente = () => {
    console.log("Aqui editar firebase");
    const document = doc(this.firestore, "cliente", this.id);

    updateDoc(document, {
      nombre_apellido: this.cliente.nombre_apellido,
      fecha_nacimiento: new Date(this.cliente.fecha_nacimiento),
      bien_asegurado: this.cliente.bien_asegurado,
      monto_asegurado: this.cliente.monto_asegurado,
    }).then(doc => {
      console.log("Registro Editado");
      this.router.navigate(['/cliente-list']);
    })
  }

  guardarCliente = () => {
    if (this.isNew) {
      this.incluirCliente();
    } else {
      this.editarCliente()
    }
  }

  incluirCliente = () => {
    console.log("Aqui incluir en firebase");
    let clientesRef = collection(this.firestore, "cliente");

    addDoc(clientesRef, {
      nombre_apellido: this.cliente.nombre_apellido,
      fecha_nacimiento: new Date(this.cliente.fecha_nacimiento),
      bien_asegurado: this.cliente.bien_asegurado,
      monto_asegurado: this.cliente.monto_asegurado,
    }).then(doc => {
      console.log("Registro Incluido");
      this.router.navigate(['/cliente-list']);
    }).catch(error => {
      console.error("Error al incluir el registro:", error);
    });
  }

  obtenerCliente = async (id: string) => {
    console.log("Aqui editar firebase")
    const document = doc(this.firestore, "cliente", id);
    const docSnap = await getDoc(document);
    if (docSnap.exists()) {
      this.cliente = docSnap.data();
      // Convertir `fecha_nacimiento` a formato `yyyy-MM-dd`
      if (this.cliente.fecha_nacimiento instanceof Timestamp) {
        this.cliente.fecha_nacimiento = this.timestampToDateInput(this.cliente.fecha_nacimiento);
      }
      console.log("Registro a editar", this.cliente);
    } else {
      this.cliente = {};
    }
  }

  timestampToDateInput(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  eliminarCliente = () => {
    console.log("Aqui eliminar en firebase");
    const document = doc(this.firestore, "cliente", this.id);
    deleteDoc(document).then(doc => {
      console.log("Registro Eliminado");
      this.router.navigateByUrl('/cliente-list');
    }).catch(error => {
      console.error("Error al eliminar el registro:", error);
    });
  }
}