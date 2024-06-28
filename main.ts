import bodyParser from "body-parser";
import { Request, Response } from 'express';
const express = require('express')
import multer from "multer";
import {calculateSimilarity, FormPage, isTextFile, JsonResponse} from "./helpers";
import * as fs from "node:fs";

declare module 'express' {
    interface Request {
        files: {
            file1: Express.Multer.File;
            file2: Express.Multer.File;
        }
    }
}
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.all('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]),
    async (req: Request & { files: { file1: Express.Multer.File[], file2: Express.Multer.File[] } }, res: Response) => {
    if (req.method === 'GET') {
        res.send(FormPage());
    } else if (req.method === 'POST') {
        const { text } = req.body;

        const file1 = req.files['file1'];
        const file2 = req.files['file2'];

        if (!text || !file1 || !file1[0] || !file1[0].buffer || !file2 || !file2[0] || !file2[0].buffer) {
            return res.send(
                `<div style="display: flex; flex-direction: column; align-items: center;">
            <div id="error-message" style="border: 5px solid red; padding: 10px; margin-top: 10px;">Error: Missing fields</div>
        </div>
        ${FormPage()}
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const errorMessage = document.getElementById('error-message');
                errorMessage.innerText = 'Error: Files are not text files';
            });
        </script>
`
        );
        }

        const file1Buffer = file1[0].buffer;
        const file2Buffer = file2[0].buffer;

        const textFromFile1 = file1Buffer.toString('utf-8');
        const textFromFile2 = file2Buffer.toString('utf-8');

        const similarityScore = calculateSimilarity(textFromFile1, textFromFile2);

        const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarityScore};`

        try {
            await fs.promises.writeFile('Ответ на запрос.txt', resultText);
            res.download('Ответ на запрос.txt');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving the file');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
});


app.all('/api',((req: Request, res: Response) => {
    try {
        if (req.method === 'GET') {
            res.json(JsonResponse());
        } else if (req.method === 'POST') {
            const jsonData = req.body;

            if (!jsonData.text || !jsonData.file1 || !jsonData.file2) {
                return res.status(400).json({ error: 'Отсутствуют необходимые поля' });
            }

            if (!isTextFile(jsonData.file1) || !isTextFile(jsonData.file2)) {
                return res.status(400).json({ error: 'Один или оба файла не являются текстовыми' });
            }

            const file1Encoding = Buffer.from(jsonData.file1, 'base64').toString('utf-8');
            const file2Encoding = Buffer.from(jsonData.file2, 'base64').toString('utf-8');

            const similarityScore = calculateSimilarity(file1Encoding, file2Encoding);

            const resultText = `Для запроса "${jsonData.text}" сходство (расстояние) равно ${similarityScore}`;

            const jsonResponse = {
                text: jsonData.text,
                similarity: similarityScore,
                result: resultText
            };

            res.json(jsonResponse);
    }
        } catch(e)  {
            res.status(405).send('Method Not Allowed');
        }
}))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
export default app
