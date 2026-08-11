const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("DesignAI backend is running!");
});

app.post("/generate-image", async (req, res) => {

    try {

        const {
            place,
            style,
            budget
        } = req.body;

        const prompt = `
Create a realistic interior design concept for a ${place}.

Design style: ${style}

Client budget: PKR ${budget}

Show a beautiful, practical renovation concept suitable for the client's budget.
Include appropriate walls, flooring, ceiling, lighting and furniture.
Make the result look like a professional interior-design visualization.
`;

        const result = await client.images.generate({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024"
        });

        res.json({
            success: true,
            image: result.data[0].b64_json
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Image generation failed."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`DesignAI backend running on port ${PORT}`);
});
