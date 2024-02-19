const sgMail = require("@sendgrid/mail");
const { API_BASE_URL, API_BASE_URL_FRONTEND } = require("../config/config.js");
const temporalPassword = require("../utils/temporalPassword.js");
const UserModel = require("../models/user.js");
const tPassword = new temporalPassword();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailSender {
  constructor(sender = "arodriguez@ingeoproyectos.com") {
    this.sender = sender;
    this.head = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          margin-top: 20px;
        }
        h2 {
          color: #27ae60;
        }
        p {
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          text-align: center;
          text-decoration: none;
          background-color: #27ae60;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
    </head>`;
  }

  createEmail(recipient, subject, temporalPassword) {
    console.log("Llega al metodo CreateEmail")
    let html = ""; // Default html
    if (subject === "Registration Confirmation") {
      html = `${this.head}
        <body>
          <div class="container">
            <h2>Confirmación de Correo</h2>
            <p>Hola ${recipient},</p>
            <p>Gracias por registrarte en Geomotica, esperamos que sea de tu agrado la plataforma, sin embargo, antes de empezar necesitamos de tu colaboración para poder brindarte el mejor servicio y seguridad, asi que necesitamos que hagas click en el siguiente botón</p>
            <a href="[ConfirmationLink]" class="button">Confirmar Registro</a>
            <p>Si no te registraste en nuestro sitio, por favor ignora este correo</p>
            <p>Los mejores deseos,<br>Geomotica</p>
          </div>
        </body>
        </html>`;
    } else if (subject === "Password Recovery") {
      html = `${this.head}
      <body>
          <div class="container">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola ${recipient},</p>
            <p>Recibimos una solicitud para cambiar tu contraseña, por favor haz clic en el enlace de abajo para obtener una contraseña temporal:</p>
            <p>SOLO ES NECESARIO PRESIONAR UNA VEZ EL BOTÓN.</p>
    <a href="${API_BASE_URL_FRONTEND}/passwordSender/${recipient}" class="button">Reiniciar Contraseña</a>
            <p>Si no solicitaste restablecer tu contraseña, por favor ignora este correo.</p>
            <p>Los mejores deseos,<br>Geomotica</p>
          </div>
      </body>
  </html>`;
    } else if (subject === "Temporal Password") {
      console.log("Estoy en el temporal password");
      html = `${this.head}
        <body>
          <div class="container">
            <h2>Contraseña Temporal</h2>
            <p>Hola ${recipient},</p>
            <p>Recibimos una solicitud para cambiar tu contraseña, tu contraseña temporal es:</p>
            <p>${temporalPassword}</p>
            <strong>Por favor cambia tu contraseña lo antes posible.</strong>
          </div>
        </body>
        </html>`;
    } else if (subject === "Account Confirmation") {
      html = `${this.head}
      <body>
          <div class="container">
            <h2>Confirmación de Cuenta</h2>
            <p>Hola ${recipient},</p>
            <p>Recibimos una solicitud para confirmar tu cuenta, por favor haz clic en el enlace de abajo para obtener una contraseña temporal:</p>
            <p>SOLO ES NECESARIO PRESIONAR UNA VEZ EL BOTÓN.</p>
            <a href="${API_BASE_URL_FRONTEND}/registerConfirmation/${recipient}" class="button">Confirmar Cuenta</a>
            <p>Si no solicitaste restablecer tu contraseña, por favor ignora este correo.</p>
            <p>Los mejores deseos,<br>Geomotica</p>
          </div>
      </body>
    </html>`;
    }

    return {
      to: recipient,
      from: this.sender,
      subject: subject,
      html: `${html}`,
    };
  }

  async sendEmail(type, recipient) {
    let subject = ""; // Default subject
    let TemporalPassword = "";
    console.log("Llega al metodo asincrono")
    if (type === "registry") {
      console.log("Llega al if de registry")
      subject = "Registration Confirmation";
    } else if (type === "recovery") {
      subject = "Password Recovery";
    } else if (type === "temporal") {
      TemporalPassword = tPassword.generateSecurePassword();
      UserModel.insertTemporalPassword(recipient, TemporalPassword);
      subject = "Temporal Password";
    } else if (type === "confirm") {
      subject = "Account Confirmation";
    }
    console.log(
      "Este es el reciente " +
        recipient +
        "Este es el subject " +
        subject +
        "Este es el temporal " +
        TemporalPassword+
        "este es el sender "+ this.sender
    );
    const msg = this.createEmail(recipient, subject, TemporalPassword);
    console.log("Este es el mensaje " ) 
    console.log(msg)
    return sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        return response[0].statusCode;
      })
      .catch((error) => {
        console.error("Error sending email:", error.message);
        throw error; // Propagate the error
      });
  }
}

module.exports = EmailSender;
