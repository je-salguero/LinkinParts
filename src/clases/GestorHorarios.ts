import { AGENCIAS, EPOCAS_ALTAS, HORARIOS } from '../datos';
import { Cita } from './Modelos';

export interface Horario {
  hora: string;
  disponible: boolean;
}

// Esta clase calcula qué horarios están libres
export class GestorHorarios {
  fncIndiceHora(hora: string): number {
    return HORARIOS.indexOf(hora);
  }

  // Fecha de hoy como AAAA-MM-DD
  fncFechaHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  // Devuelve un mensaje si la fecha no sirve, o texto vacío si está bien
  fncMensajeFecha(fecha: string): string {
    const f = new Date(fecha + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(f.getTime()) || f.toISOString().slice(0, 10) !== fecha) {
      return 'Seleccione una fecha válida.';
    }
    if (f.getUTCDay() === 0) {
      return 'El taller no atiende los domingos, elija de lunes a sábado.';
    }
    if (fecha < this.fncFechaHoy()) {
      return 'La fecha no puede ser anterior a hoy.';
    }
    return '';
  }

  // En época alta trabajan 3 jefes a la vez y en época baja solo 1
  fncObtenerCupo(fecha: string): number {
    for (const epoca of EPOCAS_ALTAS) {
      if (fecha >= epoca.inicio && fecha <= epoca.fin) {
        return 3;
      }
    }
    return 1;
  }

  // Busca un jefe que esté libre en todos los bloques que necesita el servicio.
  // Devuelve su nombre, o texto vacío si no hay ninguno.
  fncBuscarJefeLibre(citas: Cita[], agencia: string, fecha: string, hora: string, bloques: number): string {
    const agenciaEncontrada = AGENCIAS.find((a) => a.nombre === agencia);
    const inicio = this.fncIndiceHora(hora);
    // La cita tiene que terminar antes de las 12:00
    if (!agenciaEncontrada || inicio === -1 || inicio + bloques > HORARIOS.length) {
      return '';
    }

    const jefes = agenciaEncontrada.jefes;
    const cupo = this.fncObtenerCupo(fecha);
    for (let i = 0; i < cupo && i < jefes.length; i++) {
      let libre = true;
      citas.forEach((cita) => {
        if (cita.jefe !== jefes[i]) {
          return;
        }
        const inicioOtra = this.fncIndiceHora(cita.hora);
        // Se traslapan si una empieza antes de que termine la otra
        if (inicio < inicioOtra + cita.bloques && inicioOtra < inicio + bloques) {
          libre = false;
        }
      });
      if (libre) {
        return jefes[i];
      }
    }
    return '';
  }

  // Revisa cada horario: está disponible si hay un jefe libre
  fncCalcularHorarios(citas: Cita[], agencia: string, fecha: string, bloques: number): Horario[] {
    return HORARIOS.map((hora) => ({
      hora: hora,
      disponible: this.fncBuscarJefeLibre(citas, agencia, fecha, hora, bloques) !== '',
    }));
  }
}
