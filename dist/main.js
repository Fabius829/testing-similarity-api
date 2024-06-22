"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const helpers_1 = require("./helpers");
const fs = __importStar(require("node:fs"));
const express = require('express');
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const app = express();
const port = 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', ((req, res) => {
    res.send((0, helpers_1.FormPage)());
}));
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
app.post('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const file1Buffer = req.files['file1'][0].buffer;
    const file2Buffer = req.files['file2'][0].buffer;
    if (!text || !file1Buffer || !file2Buffer) {
        return res.send(`<h1>Error: Missing fields</h1>
            ${(0, helpers_1.FormPage)()}`);
    }
    const file1Base64 = file1Buffer.toString('base64');
    const file2Base64 = file2Buffer.toString('base64');
    if (!(0, helpers_1.isTextFile)(file1Base64.toString()) || !(0, helpers_1.isTextFile)(file2Base64.toString())) {
        return res.send(`<h1>Error: Files are not text files</h1>
            ${(0, helpers_1.FormPage)()}`);
    }
    const textFromFile1 = Buffer.from(file1Base64, 'base64').toString('utf-8');
    const textFromFile2 = Buffer.from(file2Base64, 'base64').toString('utf-8');
    const similarityScore = (0, helpers_1.calculateSimilarity)(textFromFile1, textFromFile2);
    const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarityScore}`;
    fs.writeFile('Ответ на запрос.txt', resultText, (err) => {
        if (err)
            throw err;
        console.log('File saved successfully!');
        res.download('Ответ на запрос.txt');
    });
}));
app.get('/api', ((req, res) => {
    res.json((0, helpers_1.JsonResponse)());
}));
app.post('/api', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    if (!jsonData.text || !jsonData.file1 || !jsonData.file2) {
        return res.status(400).json({ error: 'Отсутствуют необходимые поля' });
    }
    if (!(0, helpers_1.isTextFile)(jsonData.file1) || !(0, helpers_1.isTextFile)(jsonData.file2)) {
        return res.status(400).json({ error: 'Один или оба файла не являются текстовыми' });
    }
    const file1Encoding = Buffer.from(jsonData.file1, 'base64').toString('utf-8');
    const file2Encoding = Buffer.from(jsonData.file2, 'base64').toString('utf-8');
    const similarityScore = (0, helpers_1.calculateSimilarity)(file1Encoding, file2Encoding);
    const resultText = `Для запроса "${jsonData.text}" сходство (расстояние) равно ${similarityScore}`;
    const jsonResponse = {
        text: jsonData.text,
        similarity: similarityScore,
        result: resultText
    };
    res.json(jsonResponse);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
