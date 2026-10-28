import { Cliente, Vehiculo, Cita } from './Modelos';

// Base de datos simulada: guarda todo en memoria (se pierde al recargar la página)
export class BaseDatos {
  private clientes: Cliente[] = [];
  private vehiculos: Vehiculo[] = [];
  private citas: Cita[] = [];

  fncBuscarCliente(nit: string): Cliente | undefined {
    return this.clientes.find((c) => c.nit === nit);
  }

  fncBuscarVehiculo(tipoPlaca: string, numeroPlaca: string): Vehiculo | undefined {
    return this.vehiculos.find((v) => v.tipoPlaca === tipoPlaca && v.numeroPlaca === numeroPlaca);
  }

  fncGuardarCliente(cliente: Cliente) {
    this.clientes.push(cliente);
  }

  fncGuardarVehiculo(vehiculo: Vehiculo) {
    this.vehiculos.push(vehiculo);
  }

  fncGuardarCita(cita: Cita) {
    this.citas.push(cita);
  }

  // Citas de una agencia en una fecha
  fncCitasDelDia(agencia: string, fecha: string): Cita[] {
    return this.citas.filter((c) => c.agencia === agencia && c.fecha === fecha);
  }

  fncObtenerCitas(): Cita[] {
    return this.citas;
  }
}
