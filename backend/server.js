require("dotenv").config();

const express = require("express");
const cors = require("cors");

const OpenAI = require("openai");
const nodemailer = require("nodemailer");
const connectDB = require("./config/db");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json({ limit: "2mb" }));


// ============================================================
// HOMENEST EMAIL NOTIFICATION
// ============================================================

const emailTransporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });


// ============================================================
// PROPERTY CONFIRMATION EMAIL
// ============================================================

app.post(
    "/api/email/property-confirmed",
    async (req, res) => {

        try {

            const {
                userEmail,
                userName,
                propertyName,
                location
            } = req.body;

            if (!userEmail) {
                return res.status(400).json({
                    error: "User email is required."
                });
            }

            await emailTransporter.sendMail({

                from:
                    `"HomeNest Real Estate" <${process.env.EMAIL_USER}>`,

                to:
                    userEmail,

                subject:
                    "🎉 HomeNest Property Request Confirmed",

                html: `
                    <div style="
                        font-family:Arial,sans-serif;
                        max-width:650px;
                        margin:auto;
                        padding:30px;
                        background:#f7f8fa;
                        color:#172033;
                    ">

                        <div style="
                            background:#172033;
                            color:white;
                            padding:25px;
                            border-radius:18px;
                        ">

                            <h1 style="margin:0;">
                                🏠 HomeNest
                            </h1>

                            <p>
                                Indian Real Estate Platform
                            </p>

                        </div>

                        <div style="
                            background:white;
                            padding:28px;
                            margin-top:18px;
                            border-radius:18px;
                        ">

                            <h2>
                                🎉 Property Request Confirmed
                            </h2>

                            <p>
                                Hello
                                <strong>
                                    ${userName || "HomeNest User"}
                                </strong>,
                            </p>

                            <p>
                                Your property request has been
                                confirmed by the HomeNest
                                administrator.
                            </p>

                            <div style="
                                background:#f5f6f8;
                                padding:18px;
                                border-radius:12px;
                                margin:20px 0;
                            ">

                                <p>
                                    <strong>🏠 Property:</strong>
                                    ${propertyName || "Property"}
                                </p>

                                <p>
                                    <strong>📍 Location:</strong>
                                    ${location || "India"}
                                </p>

                                <p>
                                    <strong>✅ Status:</strong>
                                    Confirmed
                                </p>

                            </div>

                            <p>
                                Thank you for choosing HomeNest.
                            </p>

                        </div>

                    </div>
                `
            });

            console.log(
                "Confirmation email sent to:",
                userEmail
            );

            res.json({
                success: true,
                message:
                    "Confirmation email sent successfully."
            });

        } catch (error) {

            console.error(
                "EMAIL ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                error:
                    "Unable to send confirmation email."
            });
        }
    }
);
/* =========================================================
   MONGODB
========================================================= */

connectDB();

/* =========================================================
   PROPERTY API
========================================================= */

app.use("/api/properties", propertyRoutes);

/* =========================================================
   REAL AI AGENT
========================================================= */

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

app.post("/api/ai/chat", async (req, res) => {
  try {
    const {
      message,
      property,
      history = []
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message."
      });
    }

    if (!openai) {
      return res.status(500).json({
        success: false,
        message:
          "AI is not configured. Add OPENAI_API_KEY to the backend .env file."
      });
    }

    const propertyContext = property
      ? `
CURRENT PROPERTY SELECTED BY USER:

Property Name: ${property.name || "Not available"}
Type: ${property.type || "Not available"}
Location: ${property.location || "Not available"}
City: ${property.city || "Not available"}
Price: ${property.priceText || "Not available"}
Bedrooms: ${property.bedrooms ?? "Not available"}
Bathrooms: ${property.bathrooms ?? "Not available"}
Area: ${property.area || "Not available"}
Parking: ${property.parking || "Not available"}
Furnishing: ${property.furnishing || "Not available"}
Facing: ${property.facing || "Not available"}
Amenities: ${property.amenities || "Not available"}
Description: ${property.description || "Not available"}
Rating: ${property.rating ?? "Not available"}/5
Reviews: ${property.reviews ?? "Not available"}
Distance: ${property.distance || "Not available"}
`
      : `
NO PROPERTY IS CURRENTLY SELECTED.

You can still help the user search, compare and understand
the HomeNest real-estate platform.
`;

    const safeHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .filter(
            item =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .map(item => ({
            role: item.role,
            content: item.content.slice(0, 4000)
          }))
      : [];

    const systemPrompt = `
You are HomeNest Property AI Agent.

You are a professional Indian real-estate assistant.

Your job is to help users:
- understand property details
- compare properties
- evaluate properties based on budget and requirements
- explain bedrooms, bathrooms, area and amenities
- explain location information
- explain the HomeNest request/buy process
- help users decide which listed property may suit their needs
- answer general Indian real-estate questions
- explain common buying considerations

IMPORTANT RULES:

1. Use the CURRENT PROPERTY information when answering
   property-specific questions.

2. Never invent property details.

3. If information is not available, clearly say:
   "That information is not available in the current listing."

4. If the user asks whether a property is good, explain
   advantages and possible considerations instead of blindly
   saying yes.

5. If comparing properties, only use properties supplied
   in the conversation.

6. Prices are in Indian Rupees.

7. Do not claim that HomeNest has completed a legal verification
   unless the listing explicitly says so.

8. For purchase/legal questions, advise the user to verify
   title, approvals, encumbrances, taxes, registration,
   seller identity and documents with qualified professionals.

9. Be conversational and helpful like a professional AI
   property consultant.

10. Keep normal answers concise but useful.

11. If the user says hello, greet them naturally.

12. If the user asks "what can you do", explain your capabilities.

${propertyContext}
`;

    const input = [
      {
        role: "developer",
        content: systemPrompt
      },
      ...safeHistory,
      {
        role: "user",
        content: message.trim()
      }
    ];

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input,
      max_output_tokens: 700
    });

    const answer =
      response.output_text ||
      "Sorry, I could not generate a response right now.";

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        "The AI assistant is temporarily unavailable. Please try again."
    });
  }
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HomeNest Backend is running successfully 🚀"
  });
});

/* =========================================================
   EXPORT APP FOR VERCEL
========================================================= */

module.exports = app;

/* =========================================================
   LOCAL SERVER + VERCEL
========================================================= */

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Website is running: http://localhost:${PORT}`
    );
  });
}

module.exports = app;