# Car Service – Programa de Citas de Taller

Proyecto final de Análisis de Sistemas II.

**Lenguaje:** TypeScript (programación orientada a objetos) con React para la interfaz.
Los datos se guardan en memoria (base de datos simulada), así que se borran al recargar la página.

## Cómo ejecutarlo

Necesitas Node.js 20 o mayor.

```
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Cómo está organizado

```
src/
  App.tsx                 <- la interfaz (una sola vista)
  estilos.css             <- colores y diseño
  datos.ts                <- datos fijos: servicios, agencias, jefes, épocas altas, horarios
  clases/                 <- programación orientada a objetos
    Modelos.ts            <- clases Cliente, Vehiculo y Cita
    BaseDatos.ts          <- clase que guarda todo en memoria
    GestorHorarios.ts     <- clase que calcula horarios libres y jefe disponible
    ServicioCitas.ts      <- clase principal: valida y agenda la cita
```

## Reglas que cumple

- Horarios de 8:00 a 12:00 cada 30 minutos; los ocupados salen bloqueados.
- Época alta (Navidad y Semana Santa): 3 vehículos por horario; el resto del año, 1.
- La reparación dura 1 hora (2 horarios seguidos); los demás servicios, 30 minutos.
- Solo de lunes a sábado y no en fechas pasadas.
- Si la placa ya existe, se cargan los datos del contacto.
- Cada cita se asigna a un jefe de taller libre de la agencia elegida.
- Correo válido: avisa por correo; correo no válido: avisa por mensaje de texto (simulado en el mensaje de confirmación).

