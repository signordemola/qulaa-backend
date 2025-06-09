const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Invalid request method" });
  }

  const { name, company, tel, mail: email, about, bodys: inquiry } = req.body;

  if (
    !name ||
    !company ||
    !tel ||
    !email ||
    !inquiry ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid input. Please fill all required fields correctly.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Your Website Name" <sales@qulaaengineering.com>',
    to: "sales@qulaaengineering.com",
    subject: "New Contact Form Submission",
    html: `
              <h3>New Message from Contact Form</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Company:</strong> ${company}</p>
              <p><strong>Telephone:</strong> ${tel}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Where did you hear about us:</strong> ${
                about || "Not specified"
              }</p>
              <p><strong>Inquiry:</strong> ${inquiry}</p>
          `,
    text: `
              Name: ${name}
              Company: ${company}
              Telephone: ${tel}
              Email: ${email}
              Where did you hear about us: ${about || "Not specified"}
              Inquiry: ${inquiry}
          `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to send message: ${error.message}`,
    });
  }
};
