import "../App.css";
import "./Settings.css"

const Settings = () => {
  return (
    <div className="content">
      <h1>Actualizar informacion</h1>
      <div className="form">
        <form>
          <label>
            Usuario:
            <input type="text" />
            <button class = "button-settings" >Edit</button>
          </label>
          <label>
            Contrasena:
            <input type="password" />
            <button class = "button-settings" >Edit</button>
          </label>
          <label>
            Nombre Completo:
            <input type="text" />
            <button class = "button-settings" >Edit</button>
          </label>
          <label>
            correo:
            <input type="text" />
            <button class = "button-settings" >Edit</button>
          </label>
        </form>
      </div>
    </div>
  );
};

export default Settings;
