import * as FileType from 'file-type';
import bodyParser from "body-parser";
import { Express, Request, Response } from 'express';
import multer from "multer";
import {calculateSimilarity, FormPage, isTextFile, JsonResponse} from "./helpers";
import * as fs from "node:fs";

const express = require('express')

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

// app.post('/', (req: Request, res: Response) => {
//     const { text, file1, file2 } = req.body;
//
//     if (!text || !file1 || !file2) {
//         return res.send(
//             `<h1>Error: Missing fields</h1>
//         ${FormPage()}`
//     );
//     }
//
//     // Проверка, что файлы являются текстовыми
//     const isTextFile1 = Buffer.from(file1, 'base64').toString('utf-8').trim() !== '';
//     const isTextFile2 = Buffer.from(file2, 'base64').toString('utf-8').trim() !== '';
//
//     if (!isTextFile1 || !isTextFile2) {
//         return res.send(
//             `<h1>Error: Files must be text files</h1>
//         ${FormPage()}`
//     );
//     }
//
//     // Если все проверки пройдены успешно, можно продолжить обработку данных
//
//     // Далее можно добавить код для сохранения или обработки данных
//
//     res.send('Data submitted successfully!');
// })

// app.post('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]),
//    async (req: Request & { files: { file1: Express.Multer.File[], file2: Express.Multer.File[] } },
//      res: Response) => {
//     const { text } = req.body;
//     const file1 = (req.files['file1'][0] as Express.Multer.File).buffer.toString('utf-8').trim();
//     const file2 = (req.files['file2'][1] as Express.Multer.File).buffer.toString('utf-8').trim();
//
//     if (!text || !file1 || !file2) {
//         return res.send(
//             `<h1>Error: Missing fields</h1>
//         ${FormPage()}`
//     );
//     }
//         const fileType1 = await FileType.fromBuffer(file1);
//         const fileType2 = await FileType.fromBuffer(file2);
//
//        if (!fileType1 || !fileType2 || fileType1.mime !== 'text/plain' || fileType2.mime !== 'text/plain') {
//            return res.send(
//                `<h1>Error: Files must be text files</h1>
//            ${FormPage()}`
//        );
//        }
//
//        res.send('Data submitted successfully!');
// })

// app.post('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]),
//     async (req: Request & { files: { file1: Express.Multer.File[], file2: Express.Multer.File[] } },
//            res: Response) => {
//
//         const { text } = req.body;
//         const file1Buffer = (req.files['file1'][0] as Express.Multer.File).buffer;
//         const file2Buffer = (req.files['file2'][0] as Express.Multer.File).buffer;
//
//         const file1String = file1Buffer.toString('utf-8').trim();
//         const file2String = file2Buffer.toString('utf-8').trim();
//
//         if (!text || !file1String || !file2String) {
//             return res.send(
//                 `<h1>Error: Missing fields</h1>
//             ${FormPage()}`
//         );
//         }
//
//         if (!isTextFile(file1String) || !isTextFile(file2String)) {
//             return res.send(
//                 `<h1>Error: Files must be text files</h1>
//             ${FormPage()}`
//         );
//         }
//
//         res.send('Data submitted successfully!');
//     });


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

        fs.writeFile('Ответ на запрос.txt', resultText, (err) => {
            if (err) throw err;
            console.log('File saved successfully!');
            res.download('Ответ на запрос.txt');
        });
    });



app.get('/api', ((req: Request, res: Response) => {
    res.json(JsonResponse());
}))

app.post('/api', (req: Request, res: Response) => {
    const jsonData = req.body;

    console.log(jsonData)

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
