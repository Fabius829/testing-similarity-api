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



app.get('/', ((req: Request, res: Response) => {
    res.send(FormPage());
}))

app.post('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]),
     async (req: Request & { files: { file1: Express.Multer.File[], file2: Express.Multer.File[] } },
           res: Response) => {
        const { text } = req.body;
        const file1Buffer = (req.files['file1'][0] as Express.Multer.File).buffer;
        const file2Buffer = (req.files['file2'][0] as Express.Multer.File).buffer;

        if (!text || !file1Buffer || !file2Buffer) {
            return res.send(
                `<h1>Error: Missing fields</h1>
            ${FormPage()}`
        );
        }

        const file1Base64 = file1Buffer.toString('base64');
        const file2Base64 = file2Buffer.toString('base64');

        if (!isTextFile(file1Base64.toString()) || !isTextFile(file2Base64.toString())) {
            return res.send(
                `<h1>Error: Files are not text files</h1>
            ${FormPage()}`
        );
        }

        const textFromFile1 = Buffer.from(file1Base64, 'base64').toString('utf-8');
        const textFromFile2 = Buffer.from(file2Base64, 'base64').toString('utf-8');

        const similarityScore = calculateSimilarity(textFromFile1, textFromFile2);

        const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarityScore}`;

         try {
             await fs.promises.writeFile('Ответ на запрос.txt', resultText);
             res.download('Ответ на запрос.txt');
         } catch (err) {
             console.error(err);
             res.status(500).send('Error saving the file');
         }
    });


app.get('/api', ((req: Request, res: Response) => {
    res.json(JsonResponse());
}))

app.post('/api', (req: Request, res: Response) => {
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
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
export default app
