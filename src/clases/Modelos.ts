// Clases que representan la información del sistema

export class Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
  nit: string;
  correo: string;

  constructor(nombre: string, apellido: string, telefono: string, nit: string, correo: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.nit = nit;
    this.correo = correo;
  }
}

export class Vehiculo {
  tipoPlaca: string;
  numeroPlaca: string;
  cliente: Cliente; // dueño del vehículo

  constructor(tipoPlaca: string, numeroPlaca: string, cliente: Cliente) {
    this.tipoPlaca = tipoPlaca;
    this.numeroPlaca = numeroPlaca;
    this.cliente = cliente;
  }
}

export class Cita {
  vehiculo: Vehiculo;
  servicio: string;
  agencia: string;
  jefe: string; // jefe de taller asignado
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  bloques: number; // 1 = 30 minutos, 2 = 1 hora
  kilometraje: number;

  constructor(
    vehiculo: Vehiculo,
    servicio: string,
    agencia: string,
    jefe: string,
    fecha: string,
    hora: string,
    bloques: number,
    kilometraje: number
  ) {
    this.vehiculo = vehiculo;
    this.servicio = servicio;
    this.agencia = agencia;
    this.jefe = jefe;
    this.fecha = fecha;
    this.hora = hora;
    this.bloques = bloques;
    this.kilometraje = kilometraje;
  }
}
