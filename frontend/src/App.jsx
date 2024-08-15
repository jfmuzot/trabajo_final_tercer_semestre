import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import "./views/GrowingBall.css";
import LateralMenu from "./views/LateralMenu";

const App = () => {
  const [selectedItem, setSelectedItem] = useState("Ataque de Pánico");
  const [isGrowing, setIsGrowing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [ballClass, setBallClass] = useState("ball");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [tiempo_estimado, setTexto] = useState("");
  const [ShowHideBall, setHideBall] = useState(true);
  const [showRegistroTable, setShowRegistroTable] = useState(false);
  const [showUsuariosTable, setShowUsuariosTable] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [userId, setUserId] = useState(2);
  const [isGuest, setIsGuest] = useState(false);
  const [animationDuration, setAnimationDuration] = useState("10s");

  const location = useLocation();

  // Variables para manejar la edición de usuarios y registros
  const [editingUser, setEditingUser] = useState(null);
  const [editingRegistro, setEditingRegistro] = useState(null);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showEditRegistroForm, setShowEditRegistroForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nombre_usuario: "",
    contrasena: "",
    nombre_completo: "",
    correo: "",
    activo: false,
    perfil_administrador: false,
    perfil_publico: false,
    pais_id: "",
  });
  const [registroFormData, setRegistroFormData] = useState({
    tiempo: "",
    inhalaciones: "",
    exhalaciones: "",
    fecha: "",
    ciclos: "",
    id_usuario: "",
  });

  useEffect(() => {
    // Verifica si la URL contiene "guest=true" para determinar si el usuario es un invitado
    const params = new URLSearchParams(location.search);
    setIsGuest(params.get("guest") === "true");
  }, [location.search]);

  const handleSelect = (item) => {
    setSelectedItem(item);

    if (item === "Configuración") {
      setHideBall(false);
      setShowRegistroTable(false);
      setShowUsuariosTable(false);
    } else {
      setHideBall(true);
    }

    switch (item) {
      case "Estrés":
        setRecomendaciones(
          "Reducir el estrés puede ayudar a prevenir problemas de salud mental como la depresión y la ansiedad."
        );
        setTexto("Tiempo: 60 segundos");
        setAnimationDuration("9s"); // Cambia la duración de la animación a 6 segundos
        break;
      case "Ataque de Pánico":
        setRecomendaciones(
          "Practicar técnicas de respiración profunda puede ayudar a calmarte durante un ataque de pánico. Respira lenta y profundamente, enfocándote en inhalar y exhalar de manera controlada."
        );
        setTexto("Tiempo: 300 segundos");
        setAnimationDuration("7s"); // Cambia la duración de la animación a 30 segundos
        break;
      case "Ansiedad":
        setRecomendaciones(
          "El ejercicio físico regular puede reducir los niveles de ansiedad al liberar endorfinas y mejorar tu estado de ánimo. Encuentra actividades físicas que disfrutes y hazlas parte de tu rutina diaria."
        );
        setTexto("Tiempo: 120 segundos");
        setAnimationDuration("12s"); // Cambia la duración de la animación a 12 segundos
        break;
      case "Meditación":
        setRecomendaciones(
          "La meditación es conocida por su capacidad para reducir los niveles de cortisol, la hormona del estrés, en el cuerpo. Beneficios de practicar la meditación."
        );
        setTexto("Tiempo: 300 segundos");
        setAnimationDuration("15s"); // Cambia la duración de la animación a 30 segundos
        break;
      case "Concentración":
        setRecomendaciones(
          "La concentración es muy útil para mejorar la productividad y la eficiencia en tus tareas diarias. Practicar técnicas de concentración puede ayudarte a mantener el enfoque."
        );
        setTexto("Tiempo: 60-120 segundos");
        setAnimationDuration("10s"); // Cambia la duración de la animación a 10 segundos
        break;
      case "Mejor sueño":
        setRecomendaciones(
          "Dormir bien es esencial para la salud física y mental. Establecer una rutina de sueño regular y crear un ambiente relajante puede mejorar la calidad del sueño."
        );
        setTexto("Tiempo: 180 segundos");
        setAnimationDuration("13s"); // Cambia la duración de la animación a 18 segundos
        break;
      default:
        setRecomendaciones("");
        setTexto("");
        setAnimationDuration("10s");
        break;
    }
  };

  const saveRegistro = async ({ tiempo, inhalaciones, exhalaciones, ciclos, id_usuario }) => {
    const response = await fetch("http://localhost:3000/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tiempo,
        inhalaciones,
        exhalaciones,
        fecha: new Date().toISOString().split("T")[0], // Fecha actual
        ciclos,
        id_usuario,
      }),
    });

    if (!response.ok) {
      console.error("Error al guardar el registro:", response.statusText);
    } else {
      const data = await response.json();
      console.log("Registro guardado exitosamente:", data);
    }
  };

  const handleButtonClick = () => {
    setIsGrowing(!isGrowing);
    if (!isGrowing) {
      setTimer(0); // Reinicia el contador cuando se empieza de nuevo
      setBallClass("ball grow");
      setCiclos(0);
    } else {
      setBallClass("ball");

      // El juego ha terminado, guarda los resultados finales
      const finalInhalacion = parseInt(localStorage.getItem("inhalacion"));
      const finalExhalacion = parseInt(localStorage.getItem("exhalacion"));
      const finalCiclos = parseFloat(localStorage.getItem("ciclos"));

      console.log(`Resultados finales:`);
      console.log(`Inhalación final: ${finalInhalacion} segundos`);
      console.log(`Exhalación final: ${finalExhalacion} segundos`);
      console.log(`Ciclos completados: ${finalCiclos}`);

      // Guardar el registro en la base de datos
      saveRegistro({
        tiempo: timer, // Tiempo total
        inhalaciones: finalInhalacion,
        exhalaciones: finalExhalacion,
        ciclos: finalCiclos,
        id_usuario: userId, // ID del usuario logueado
      });
    }
  };

  const handleEditUser = (usuario) => {
    // Abre un formulario con los datos del usuario para editar
    setEditingUser(usuario);
    setUserFormData(usuario); // Carga los datos del usuario seleccionado en el formulario
    setShowEditUserForm(true);
  };

  const handleEditRegistro = (registro) => {
    // Abre un formulario con los datos del registro para editar
    setEditingRegistro(registro);
    setRegistroFormData(registro); // Carga los datos del registro seleccionado en el formulario
    setShowEditRegistroForm(true);
  };

  const handleDeleteUser = async (id) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuario/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log(`Usuario con ID: ${id} eliminado exitosamente.`);
          // Después de eliminar, actualiza la tabla para reflejar los cambios
          fetchUsuarios();
        } else {
          console.error(`Error al eliminar el usuario con ID: ${id}`);
        }
      } catch (error) {
        console.error(`Error al intentar eliminar el usuario:`, error);
      }
    }
  };

  const handleDeleteRegistro = async (id) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este registro?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/registro/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log(`Registro con ID: ${id} eliminado exitosamente.`);
          // Después de eliminar, actualiza la tabla para reflejar los cambios
          fetchRegistros();
        } else {
          console.error(`Error al eliminar el registro con ID: ${id}`);
        }
      } catch (error) {
        console.error(`Error al intentar eliminar el registro:`, error);
      }
    }
  };

  const handleRegistroClick = () => {
    setShowRegistroTable(true);
    setShowUsuariosTable(false);
    fetchRegistros(); // Llamar a la función para obtener los registros cuando se selecciona "Registro"
  };

  const handleUsuariosClick = () => {
    setShowRegistroTable(false);
    setShowUsuariosTable(true);
    fetchUsuarios(); // Llamar a la función para obtener los usuarios cuando se selecciona "Usuarios"
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistroInputChange = (e) => {
    const { name, value } = e.target;
    setRegistroFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/usuario/${editingUser.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userFormData),
        }
      );

      if (response.ok) {
        console.log("Usuario actualizado exitosamente.");
        setShowEditUserForm(false);
        fetchUsuarios(); // Actualizar la tabla de usuarios
      } else {
        console.error("Error al actualizar el usuario.");
      }
    } catch (error) {
      console.error("Error al intentar actualizar el usuario:", error);
    }
  };

  const handleUpdateRegistro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/registro/${editingRegistro.id_registro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registroFormData),
        }
      );

      if (response.ok) {
        console.log("Registro actualizado exitosamente.");
        setShowEditRegistroForm(false);
        fetchRegistros(); // Actualizar la tabla de registros
      } else {
        console.error("Error al actualizar el registro.");
      }
    } catch (error) {
      console.error("Error al intentar actualizar el registro:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario"); // Cambia la URL si es necesario
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRegistros = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/registro"); // Cambia la URL si es necesario
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      console.error("Error fetching registros:", error);
    }
  };

  const menuItems = [
    "Estrés",
    "Ataque de Pánico",
    "Ansiedad",
    "Meditación",
    "Concentración",
    "Mejor sueño",
    "Configuración",
  ];

  // Efecto para actualizar el contador cada segundo cuando isGrowing es true
  useEffect(() => {
    let intervalId;
    if (isGrowing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isGrowing]);

  // Efecto para manejar el ciclo de crecimiento y contracción de la bola
  useEffect(() => {
    if (isGrowing) {
      const ballElement = document.querySelector(".ball");
      const handleAnimationIteration = (event) => {
        if (event.animationName === "growShrink") {
          if (ballClass.includes("grow")) {
            // La bola ha alcanzado su punto máximo - Inhalación
            console.log(`Inhalación: ${timer} segundos`);
            const inhalacion = timer;
            console.log(`Exhalación: ${timer + 1} segundos`);
            const exhalacion = timer + 1;
            const ciclos = inhalacion / 10;
            console.log(`Ciclos: ${ciclos}`);

            // Guardar en localStorage
            localStorage.setItem("inhalacion", inhalacion);
            localStorage.setItem("exhalacion", exhalacion);
            localStorage.setItem("ciclos", ciclos);
          }
        }
      };

      ballElement.addEventListener(
        "animationiteration",
        handleAnimationIteration
      );

      return () => {
        ballElement.removeEventListener(
          "animationiteration",
          handleAnimationIteration
        );
      };
    }
  }, [isGrowing, timer, ballClass]);

  // Leer valores de localStorage al cargar el componente
  useEffect(() => {
    const savedInhalacion = localStorage.getItem("inhalacion");
    const savedExhalacion = localStorage.getItem("exhalacion");
    const savedCiclos = localStorage.getItem("ciclos");

    if (savedInhalacion) {
      console.log(`Inhalación guardada: ${savedInhalacion} segundos`);
    }
    if (savedExhalacion) {
      console.log(`Exhalación guardada: ${savedExhalacion} segundos`);
    }
    if (savedCiclos) {
      console.log(`Ciclos guardados: ${savedCiclos}`);
    }
  }, []);

  return (
    <div className="app">
      <LateralMenu
        items={menuItems}
        onSelect={handleSelect}
        onConfigClick={() => setHideBall(false)}
        isGuest={isGuest} // Pasa si el usuario es un invitado o no
      />
      <div className="content">
        <h1>{selectedItem}</h1>
        {ShowHideBall ? (
          <div
            className={ballClass}
            style={{ animationDuration: animationDuration }}
            onClick={handleButtonClick}
          >
            <div className="inner-ball">
              {isGrowing && <span className="timer">{timer} seg</span>}
            </div>
            {!isGrowing && (
              <i className="fas fa-hand-pointer icon-click"></i> /* Icono de clic */
            )}
          </div>
        ) : (
          <div>
            <button className="config-button" onClick={handleRegistroClick}>
              Registro
            </button>
            <button className="config-button" onClick={handleUsuariosClick}>
              Usuarios
            </button>

            {showEditUserForm && (
              <div className="edit-form">
                <h2>Editar Usuario</h2>
                <form onSubmit={handleUpdateUser}>
                  <div>
                    <label>Nombre de Usuario:</label>
                    <input
                      type="text"
                      name="nombre_usuario"
                      value={userFormData.nombre_usuario}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Contraseña:</label>
                    <input
                      type="password"
                      name="contrasena"
                      value={userFormData.contrasena}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Nombre Completo:</label>
                    <input
                      type="text"
                      name="nombre_completo"
                      value={userFormData.nombre_completo}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Correo:</label>
                    <input
                      type="email"
                      name="correo"
                      value={userFormData.correo}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Activo:</label>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={userFormData.activo}
                      onChange={() =>
                        setUserFormData({
                          ...userFormData,
                          activo: !userFormData.activo,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Perfil Administrador:</label>
                    <input
                      type="checkbox"
                      name="perfil_administrador"
                      checked={userFormData.perfil_administrador}
                      onChange={() =>
                        setUserFormData({
                          ...userFormData,
                          perfil_administrador:
                            !userFormData.perfil_administrador,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Perfil Público:</label>
                    <input
                      type="checkbox"
                      name="perfil_publico"
                      checked={userFormData.perfil_publico}
                      onChange={() =>
                        setUserFormData({
                          ...userFormData,
                          perfil_publico: !userFormData.perfil_publico,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>País ID:</label>
                    <input
                      type="text"
                      name="pais_id"
                      value={userFormData.pais_id}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                  <button type="submit">Actualizar Usuario</button>
                  <button
                    type="button"
                    onClick={() => setShowEditUserForm(false)}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            )}

            {showEditRegistroForm && (
              <div className="edit-form">
                <h2>Editar Registro</h2>
                <form onSubmit={handleUpdateRegistro}>
                  <div>
                    <label>Tiempo:</label>
                    <input
                      type="text"
                      name="tiempo"
                      value={registroFormData.tiempo}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Inhalaciones:</label>
                    <input
                      type="text"
                      name="inhalaciones"
                      value={registroFormData.inhalaciones}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Exhalaciones:</label>
                    <input
                      type="text"
                      name="exhalaciones"
                      value={registroFormData.exhalaciones}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Fecha:</label>
                    <input
                      type="date"
                      name="fecha"
                      value={registroFormData.fecha}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Ciclos:</label>
                    <input
                      type="text"
                      name="ciclos"
                      value={registroFormData.ciclos}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>ID Usuario:</label>
                    <input
                      type="text"
                      name="id_usuario"
                      value={registroFormData.id_usuario}
                      onChange={handleRegistroInputChange}
                      required
                    />
                  </div>
                  <button type="submit">Actualizar Registro</button>
                  <button
                    type="button"
                    onClick={() => setShowEditRegistroForm(false)}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            )}

            {showRegistroTable && (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Registro</th>
                      <th>Tiempo</th>
                      <th>Inhalaciones</th>
                      <th>Exhalaciones</th>
                      <th>Fecha</th>
                      <th>Ciclos</th>
                      <th>Id Usuario</th>
                      <th>Editar</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((registro) => (
                      <tr key={registro.id_registro}>
                        <td>{registro.id_registro}</td>
                        <td>{registro.tiempo}</td>
                        <td>{registro.inhalaciones}</td>
                        <td>{registro.exhalaciones}</td>
                        <td>{registro.fecha}</td>
                        <td>{registro.ciclos}</td>
                        <td>{registro.id_usuario}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditRegistro(registro)}
                          >
                            Editar
                          </button>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteRegistro(registro.id_registro)
                            }
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showUsuariosTable && (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Usuario</th>
                      <th>Nombre Usuario</th>
                      <th>Contraseña</th>
                      <th>Correo</th>
                      <th>Activo</th>
                      <th>Perfil Administrador</th>
                      <th>País ID</th>
                      <th>Editar</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id_usuario}>
                        <td>{usuario.id_usuario}</td>
                        <td>{usuario.nombre_usuario}</td>
                        <td>{usuario.contrasena}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.activo ? "Sí" : "No"}</td>
                        <td>
                          {usuario.perfil_administrador ? "Sí" : "No"}
                        </td>
                        <td>{usuario.pais_id}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditUser(usuario)}
                          >
                            Editar
                          </button>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(usuario.id_usuario)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Outlet />
      <div className="info">
        <h1>¿Cómo lo uso?</h1>
        <p>
          Para empezar, haz clic en la bola. Comenzará un contador que te ayudará
          a medir tus tiempos y progreso en el ejercicio. Debes inhalar hasta que
          la bola alcance su tamaño máximo y luego sostener la respiración mientras
          la bola comienza a encogerse. Cuando esto suceda, debes exhalar y repetir
          el ciclo.
        </p>
        <ul>
          <li>Estrés: 60 segundos</li>
          <li>Ataque de Pánico: 300 segundos</li>
          <li>Ansiedad: 120 segundos</li>
          <li>Meditación: 300 segundos</li>
          <li>Concentración: 60-120 segundos</li>
          <li>Mejor sueño: 180 segundos</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
