const apartmentRegistrationTemplate = (
  apartmentName: string,
  location: string,
  name: string
): string => {
  const imageUrl =
    "https://res.cloudinary.com/dtp9j0ypi/image/upload/v1723781193/VRENTAL/lvv5fk4wng5cugrx8odk.png"; // Ensure this path is publicly accessible

  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>Apartment Registration Email</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }
  
      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }
  
      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
  
      .body {
        font-size: 16px;
        margin-bottom: 20px;
      }
  
      .cta {
        display: inline-block;
        padding: 10px 20px;
        background-color: #FFD60A;
        color: #000000;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
      }
  
      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
  
      .highlight {
        font-weight: bold;
      }
    </style>
  
  </head>
  
  <body>
    <div class="container">
      <a href="https://www.vrental.in"><img class="logo" src="${imageUrl}" alt="Company Logo"></a>
      <div class="message">Apartment Registration Successful</div>
      <div class="body">
        <p>Dear ${name},</p>
        <p>Your apartment registration for <span class="highlight">${apartmentName}</span> located at <span class="highlight">${location}</span> has been successful.</p>
        <p>The apartment owner will contact you soon for further details.</p>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a>. We are here to help!</div>
    </div>
  </body>
  
  </html>`;
};

export default apartmentRegistrationTemplate;
