const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailSender {
  constructor(sender = "arodriguez@ingeoproyectos.com") {
    this.sender = sender;
  }

  createEmail(recipient, subject) {
    let html = ""; // Default html
    if(subject === "Registration Confirmation"){
        html = `<!DOCTYPE html>
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
            }
          </style>
        </head>
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
    }
    else if(subject === "Password Recovery"){
        html = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Recovery</title>
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
              color: #3498db;
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
              background-color: #3498db;
              color: #fff;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola ${recipient},</p>
            <p>Recibimos una solicitud para cambiar tu contraseña, por favor clickea en el enlace de abajo para poder tener una contraseña temporal:</p>
            <a href="[ResetLink]" class="button">Reiniciar Contraseña</a>
            <p>Si no mandaste ninguna solicitud de resetear tu contraseña por favor ignora este correo.</p>
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

  sendEmail(type, recipient) {
    let subject = ""; // Default subject
    if (type === "registry") {
      subject = "Registration Confirmation";
    } else if (type === "recovery") {
      subject = "Password Recovery";
    }

    const msg = this.createEmail(recipient, subject);

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