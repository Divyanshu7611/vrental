const otpTemplate = (tharID: string, name: string): string => {
  const imageUrl =
    "https://res.cloudinary.com/dtp9j0ypi/image/upload/v1721746505/VRENTAL/bbb1qeehsxkhyur7imh6.jpg"; // Ensure this path is publicly accessible

  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification Email - THAR</title>
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
        backgroun-color:black;
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
      <a href="https://www.vrental.in"><img class="logo" src="${imageUrl}" alt="vrental"></a>
      <div class="message">Registration Successful ||  THAR25</div>
      <div class="body">
        <p>Dear ${name},</p>
        <p>Thank you for registering with VRENTAL. Your VRENTAL ID is</p>
        <h2 class="highlight">${tharID}</h2>
        <p>Search Apartments on your desired loaction at best prices.</p>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
          href="mailto:support@vrental.in">support@vrental.in</a>. We are here to help!</div>
    </div>
  </body>
  
  </html>`;
};

export default otpTemplate;
