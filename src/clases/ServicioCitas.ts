import { TIPOS_PLACA, SERVICIOS, AGENCIAS } from '../datos';
import { Cliente, Vehiculo, Cita } from './Modelos';
import { BaseDatos } from './BaseDatos';
import { GestorHorarios, Horario } from './GestorHorarios';

// Datos que el cliente llena en el formulario
export interface DatosCita {
  tipoPlaca: string;
  numeroPlaca: string;
  kilometraje: string;
  nombre: string;
  apellido: string;
  telefono: string;
  nit: string;
  correo: string;
  servicio: string;
  agencia: string;
  fecha: string;
  hora: string;
}

// Clase principal: junta las demás clases para validar y agendar una cita
export class ServicioCitas {
  private baseDatos: BaseDatos;
  private gestor: GestorHorarios;

  constructor(baseDatos: BaseDatos) {
    this.baseDatos = baseDatos;
    this.gestor = new GestorHorarios();
  }

  fncFechaHoy(): string {
    return this.gestor.fncFechaHoy();
  }

  fncMensajeFecha(fecha: string): string {
    return this.gestor.fncMensajeFecha(fecha);
  }

  fncObtenerCitas(): Cita[] {
    return this.baseDatos.fncObtenerCitas();
  }

  // Si la placa ya está registrada devuelve a su dueño para cargar los datos del contacto
  fncBuscarPlaca(tipoPlaca: string, numeroPlaca: string): Cliente | undefined {
    const vehiculo = this.baseDatos.fncBuscarVehiculo(tipoPlaca, numeroPlaca.trim().toUpperCase());
    return vehiculo ? vehiculo.cliente : undefined;
  }

  // Horarios que se muestran después de elegir servicio, agencia y fecha
  fncObtenerHorarios(agencia: string, fecha: string, servicio: string): Horario[] {
    const bloques = this.fncBloquesDelServicio(servicio);
    if (bloques === 0 || this.gestor.fncMensajeFecha(fecha) !== '') {
      return [];
    }
    const citas = this.baseDatos.fncCitasDelDia(agencia, fecha);
    return this.gestor.fncCalcularHorarios(citas, agencia, fecha, bloques);
  }

  // Proceso completo para agendar la cita
  fncAgendarCita(datos: DatosCita): { ok: boolean; mensaje: string } {
    // 1. Se limpian y se validan los datos
    const d = this.fncLimpiarDatos(datos);
    const error = this.fncValidarDatos(d);
    if (error !== '') {
      return { ok: false, mensaje: error };
    }

    // 2. Se busca un jefe de taller libre en ese horario
    const bloques = this.fncBloquesDelServicio(d.servicio);
    const citasDelDia = this.baseDatos.fncCitasDelDia(d.agencia, d.fecha);
    const jefe = this.gestor.fncBuscarJefeLibre(citasDelDia, d.agencia, d.fecha, d.hora, bloques);
    if (jefe === '') {
      return { ok: false, mensaje: 'Ese horario ya no está disponible, elija otro.' };
    }

    // 3. Si la placa es nueva se guarda el vehículo (y el cliente si el NIT es nuevo)
    let vehiculo = this.baseDatos.fncBuscarVehiculo(d.tipoPlaca, d.numeroPlaca);
    if (!vehiculo) {
      let cliente = this.baseDatos.fncBuscarCliente(d.nit);
      if (!cliente) {
        cliente = new Cliente(d.nombre, d.apellido, d.telefono, d.nit, d.correo);
        this.baseDatos.fncGuardarCliente(cliente);
      }
      vehiculo = new Vehiculo(d.tipoPlaca, d.numeroPlaca, cliente);
      this.baseDatos.fncGuardarVehiculo(vehiculo);
    }

    // 4. Se guarda la cita
    const cita = new Cita(vehiculo, d.servicio, d.agencia, jefe, d.fecha, d.hora, bloques, Number(d.kilometraje));
    this.baseDatos.fncGuardarCita(cita);

    // 5. Se arma el mensaje de confirmación para el cliente
    const mensaje =
      `Cita agendada: ${d.servicio}, ${d.fecha.split('-').reverse().join('/')} a las ${d.hora}, ` +
      `${d.agencia}, placa ${d.numeroPlaca}. Jefe de taller: ${jefe}. ` +
      this.fncMensajeAviso(vehiculo.cliente);
    return { ok: true, mensaje: mensaje };
  }

  // Correo si es válido; si no, mensaje de texto al teléfono (el envío es simulado)
  private fncMensajeAviso(cliente: Cliente): string {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo)) {
      return `Se envió un correo a ${cliente.correo}.`;
    }
    return `El correo no es válido, se envió un mensaje de texto al ${cliente.telefono}.`;
  }

  // Cuántos bloques de 30 minutos dura el servicio (0 si no existe)
  private fncBloquesDelServicio(nombre: string): number {
    const servicio = SERVICIOS.find((s) => s.nombre === nombre);
    return servicio ? servicio.bloques : 0;
  }

  // Quita espacios y pasa la placa a mayúsculas
  private fncLimpiarDatos(datos: DatosCita): DatosCita {
    return {
      tipoPlaca: datos.tipoPlaca.trim(),
      numeroPlaca: datos.numeroPlaca.trim().toUpperCase(),
      kilometraje: datos.kilometraje.trim(),
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      telefono: datos.telefono.trim(),
      nit: datos.nit.trim(),
      correo: datos.correo.trim(),
      servicio: datos.servicio,
      agencia: datos.agencia,
      fecha: datos.fecha,
      hora: datos.hora,
    };
  }

  // Devuelve el primer error que encuentre, o texto vacío si todo está bien
  private fncValidarDatos(d: DatosCita): string {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
    if (!TIPOS_PLACA.includes(d.tipoPlaca)) return 'Seleccione el tipo de placa.';
    if (!/^[A-Z0-9]{5,8}$/.test(d.numeroPlaca)) return 'La placa debe tener de 5 a 8 letras o números, sin espacios.';
    if (!/^[1-9]\d*$/.test(d.kilometraje)) return 'El kilometraje debe ser un número entero mayor que cero.';
    if (!soloLetras.test(d.nombre)) return 'El nombre es obligatorio y solo puede tener letras.';
    if (!soloLetras.test(d.apellido)) return 'El apellido es obligatorio y solo puede tener letras.';
    if (!/^\d{8}$/.test(d.telefono)) return 'El teléfono debe tener 8 dígitos, sin guiones.';
    if (!/^\d{4,9}-[0-9Kk]$/.test(d.nit)) return 'El NIT debe llevar un guion antes del último dígito, por ejemplo 1234567-8.';
    if (d.correo === '') return 'El correo electrónico es obligatorio.';
    if (this.fncBloquesDelServicio(d.servicio) === 0) return 'Seleccione el tipo de servicio.';
    if (!AGENCIAS.some((a) => a.nombre === d.agencia)) return 'Seleccione la agencia.';
    const mensajeFecha = this.gestor.fncMensajeFecha(d.fecha);
    if (mensajeFecha !== '') return mensajeFecha;
    if (d.hora === '') return 'Seleccione el horario de recepción.';
    return '';
  }
}
