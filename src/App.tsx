import { useState, ChangeEvent, FormEvent } from 'react';
import { TIPOS_PLACA, SERVICIOS, AGENCIAS } from './datos';
import { BaseDatos } from './clases/BaseDatos';
import { ServicioCitas, DatosCita } from './clases/ServicioCitas';
// @ts-expect-error CSS imports are handled by the app bundler.
import './estilos.css';

// Se crea una sola vez: la "base de datos" en memoria y el servicio que la usa
const servicioCitas = new ServicioCitas(new BaseDatos());

// Formulario en blanco
const datosVacios: DatosCita = {
  tipoPlaca: '',
  numeroPlaca: '',
  kilometraje: '',
  nombre: '',
  apellido: '',
  telefono: '',
  nit: '',
  correo: '',
  servicio: '',
  agencia: '',
  fecha: '',
  hora: '',
};

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 64 64" role="img" aria-label="Logo de Car Service">
      <circle cx="32" cy="32" r="31" fill="#fff" />
      <path d="M11 40 L15 29 Q16.5 25 21 25 H43 Q47.5 25 49 29 L53 40 V45 H11 Z" fill="#1f4e79" />
      <path d="M20 29 H30 V36 H17.5 Z M34 29 H44 L46.5 36 H34 Z" fill="#fff" />
      <circle cx="21" cy="45" r="5.5" fill="#1f4e79" stroke="#fff" strokeWidth="2" />
      <circle cx="43" cy="45" r="5.5" fill="#1f4e79" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function App() {
  const [datos, setDatos] = useState(datosVacios);
  const [citas, setCitas] = useState(servicioCitas.fncObtenerCitas());
  const [mensajePlaca, setMensajePlaca] = useState('');
  const [placaRegistrada, setPlacaRegistrada] = useState(false);
  const [resultado, setResultado] = useState({ ok: true, mensaje: '' });

  // Los horarios se calculan cada vez que se dibuja la pantalla
  const mensajeFecha = datos.fecha ? servicioCitas.fncMensajeFecha(datos.fecha) : '';
  const horarios = servicioCitas.fncObtenerHorarios(datos.agencia, datos.fecha, datos.servicio);

  // Guarda lo que el cliente escribe en cada campo
  function fncCambiarCampo(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const nuevosDatos = { ...datos, [e.target.name]: e.target.value };
    // Si cambia algo que afecta los horarios, se borra el horario elegido
    if (['servicio', 'agencia', 'fecha'].includes(e.target.name)) {
      nuevosDatos.hora = '';
    }
    // Si cambia la placa, hay que buscarla otra vez
    if (['tipoPlaca', 'numeroPlaca'].includes(e.target.name)) {
      setPlacaRegistrada(false);
      setMensajePlaca('');
    }
    setDatos(nuevosDatos);
    setResultado({ ok: true, mensaje: '' });
  }

  // Botón "Buscar placa": si ya existe, llena los datos del contacto
  function fncBuscarPlaca() {
    if (!datos.tipoPlaca || !datos.numeroPlaca) {
      setMensajePlaca('Seleccione el tipo y escriba el número de placa.');
      return;
    }
    const cliente = servicioCitas.fncBuscarPlaca(datos.tipoPlaca, datos.numeroPlaca);
    if (cliente) {
      setDatos({
        ...datos,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        nit: cliente.nit,
        correo: cliente.correo,
      });
      setPlacaRegistrada(true);
      setMensajePlaca('Vehículo registrado: se cargaron los datos del contacto.');
    } else {
      setMensajePlaca('Placa nueva: llene los datos del contacto.');
    }
  }

  // Botón "Agendar cita"
  function fncAgendarCita(e: FormEvent) {
    e.preventDefault();
    const respuesta = servicioCitas.fncAgendarCita(datos);
    setResultado(respuesta);
    if (respuesta.ok) {
      // Se actualiza la lista de citas y se deja el formulario en blanco
      setCitas([...servicioCitas.fncObtenerCitas()]);
      setDatos(datosVacios);
      setMensajePlaca('');
      setPlacaRegistrada(false);
    }
  }

  return (
    <>
      <header className="encabezado">
        <Logo />
        <div>
          <h1>Linking Parts</h1>
          <p>Programa de Citas de Taller</p>
        </div>
      </header>

      <form className="contenido" onSubmit={fncAgendarCita}>
        {/* Columna 1: vehículo y contacto */}
        <div>
          <section className="seccion">
            <h2>Datos del vehículo</h2>
            <div className="fila">
              <div className="campo">
                <label>Tipo de placa *</label>
                <select name="tipoPlaca" value={datos.tipoPlaca} onChange={fncCambiarCampo}>
                  <option value="">Seleccione</option>
                  {TIPOS_PLACA.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div className="campo">
                <label>Número de placa *</label>
                <input name="numeroPlaca" value={datos.numeroPlaca} onChange={fncCambiarCampo} placeholder="123ABC" />
              </div>
              <div className="campo boton-fila">
                <button type="button" className="boton" onClick={fncBuscarPlaca}>Buscar</button>
              </div>
            </div>
            <p className="nota">{mensajePlaca || 'Busque la placa para cargar los datos si ya está registrada.'}</p>
            <div className="campo">
              <label>Kilometraje *</label>
              <input name="kilometraje" value={datos.kilometraje} onChange={fncCambiarCampo} placeholder="45000" />
            </div>
          </section>

          <section className="seccion">
            <h2>Datos del contacto</h2>
            <div className="fila">
              <div className="campo">
                <label>Nombre *</label>
                <input name="nombre" value={datos.nombre} onChange={fncCambiarCampo} readOnly={placaRegistrada} />
              </div>
              <div className="campo">
                <label>Apellido *</label>
                <input name="apellido" value={datos.apellido} onChange={fncCambiarCampo} readOnly={placaRegistrada} />
              </div>
            </div>
            <div className="fila">
              <div className="campo">
                <label>Teléfono *</label>
                <input name="telefono" value={datos.telefono} onChange={fncCambiarCampo} readOnly={placaRegistrada} placeholder="55551234" />
              </div>
              <div className="campo">
                <label>NIT *</label>
                <input name="nit" value={datos.nit} onChange={fncCambiarCampo} readOnly={placaRegistrada} placeholder="1234567-8" />
              </div>
            </div>
            <div className="campo">
              <label>Correo electrónico *</label>
              <input name="correo" value={datos.correo} onChange={fncCambiarCampo} readOnly={placaRegistrada} placeholder="cliente@correo.com" />
            </div>
          </section>
        </div>

        {/* Columna 2: servicio, fecha y horario */}
        <div>
          <section className="seccion">
            <h2>Datos del servicio</h2>
            <div className="campo">
              <label>Tipo de servicio *</label>
              <select name="servicio" value={datos.servicio} onChange={fncCambiarCampo}>
                <option value="">Seleccione</option>
                {SERVICIOS.map((s) => (
                  <option key={s.nombre} value={s.nombre}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Agencia *</label>
              <select name="agencia" value={datos.agencia} onChange={fncCambiarCampo}>
                <option value="">Seleccione</option>
                {AGENCIAS.map((a) => (
                  <option key={a.nombre} value={a.nombre}>{a.nombre}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="seccion">
            <h2>Fecha y horario</h2>
            <div className="campo">
              <label>Fecha de servicio *</label>
              <input type="date" name="fecha" value={datos.fecha} min={servicioCitas.fncFechaHoy()} onChange={fncCambiarCampo} />
            </div>
            <label className="etiqueta">Horario de recepción *</label>
            <div className="horarios">
              {horarios.map((h) => (
                <button
                  type="button"
                  key={h.hora}
                  disabled={!h.disponible}
                  className={datos.hora === h.hora ? 'hora sel' : 'hora'}
                  onClick={() => setDatos({ ...datos, hora: h.hora })}
                >
                  {h.hora}
                </button>
              ))}
            </div>
            {mensajeFecha && <p className="error">{mensajeFecha}</p>}
            {!mensajeFecha && horarios.length === 0 && (
              <p className="nota">Elija servicio, agencia y fecha para ver los horarios.</p>
            )}
            {horarios.length > 0 && (
              <p className="nota">
                Los horarios en gris están ocupados.
                {datos.servicio === 'Reparación' && ' La reparación dura 1 hora (2 horarios seguidos).'}
              </p>
            )}
          </section>

          <button type="submit" className="boton grande">Agendar cita</button>
          {resultado.mensaje && (
            <p className={resultado.ok ? 'mensaje ok' : 'mensaje error'}>{resultado.mensaje}</p>
          )}
        </div>

        {/* Columna 3: citas guardadas */}
        <section className="seccion">
          <h2>Citas agendadas ({citas.length})</h2>
          {citas.length === 0 ? (
            <p className="nota">Todavía no hay citas guardadas.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Placa</th>
                  <th>Servicio</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c, i) => (
                  <tr key={i}>
                    <td>{c.fecha.split('-').reverse().join('/')}</td>
                    <td>{c.hora}</td>
                    <td>{c.vehiculo.numeroPlaca}</td>
                    <td>{c.servicio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </form>
    </>
  );
}

export default App;
