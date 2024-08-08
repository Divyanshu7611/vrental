const apartmentRegistrationOwnerTemplate = (
  apartmentName: string,
  location: string,
  userName: string,
  userPhone: string
): string => {
  const imageUrl =
    "https://res.cloudinary.com/dtp9j0ypi/image/upload/v1721746505/VRENTAL/bbb1qeehsxkhyur7imh6.jpg"; // Ensure this path is publicly accessible

  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>New Apartment Registration</title>
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
      <a href="https://www.yourwebsite.com"><img class="logo" src="${imageUrl}" alt="Company Logo"></a>
      <div class="message">New Apartment Registration</div>
      <div class="body">
        <p>Dear Owner,</p>
        <p>A user has shown interest in your apartment <span class="highlight">${apartmentName}</span> located at <span class="highlight">${location}</span>.</p>
        <p>User details:</p>
        <p>Name: <span class="highlight">${userName}</span></p>
        <p>Phone: <span class="highlight">${userPhone}</span></p>
        <p>Please contact the user for further details.</p>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a>. We are here to help!</div>
    </div>
  </body>
  
  </html>`;
};

export default apartmentRegistrationOwnerTemplate;
