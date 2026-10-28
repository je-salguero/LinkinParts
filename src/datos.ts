// Datos fijos del taller

export const TIPOS_PLACA = ['Particular', 'Comercial', 'Moto'];

// "bloques" son de 30 minutos: la reparación dura 2 bloques (1 hora) y los demás 1 bloque
export const SERVICIOS = [
  { nombre: 'Mantenimiento preventivo', bloques: 1 },
  { nombre: 'Diagnóstico', bloques: 1 },
  { nombre: 'Reparación', bloques: 2 },
  { nombre: 'Mecánica general', bloques: 1 },
];

// Agencias con sus jefes de taller
export const AGENCIAS = [
  { nombre: 'Agencia Zona 1', jefes: ['Carlos Méndez', 'Luis Ramírez', 'Ana López'] },
  { nombre: 'Agencia Zona 10', jefes: ['Pedro Castillo', 'Marta Gómez', 'Jorge Pérez'] },
];

// Épocas altas: se reciben 3 vehículos por horario (el resto del año se recibe 1)
export const EPOCAS_ALTAS = [
  { nombre: 'Navidad', inicio: '2026-12-15', fin: '2026-12-31' },
  { nombre: 'Semana Santa', inicio: '2027-03-22', fin: '2027-03-27' },
];

// Se recibe de 8:00 AM a 12:00 PM, cada 30 minutos
export const HORARIOS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
