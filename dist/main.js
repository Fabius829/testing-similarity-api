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
const express = require('express');
const multer_1 = __importDefault(require("multer"));
const helpers_1 = require("./helpers");
const fs = __importStar(require("node:fs"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const app = express();
const port = 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express.json());
// app.all('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req: Request & { files: { file1: Express.Multer.File[], file2: Express.Multer.File[] } }, res: Response) => {
//     if (req.method === 'GET') {
//         res.send(FormPage());
//     } else if (req.method === 'POST') {
//         const { text } = req.body;
//         const file1Buffer = (req.files['file1'][0] as Express.Multer.File).buffer;
//         const file2Buffer = (req.files['file2'][0] as Express.Multer.File).buffer;
//
//         if (!text || !file1Buffer || !file2Buffer) {
//             return res.send(
//                 `<h1>Error: Missing fields</h1>
//             ${FormPage()}`
//         );
//         }
//
//         const file1Base64 = file1Buffer.toString('base64');
//         const file2Base64 = file2Buffer.toString('base64');
//
//         if (!isTextFile(file1Base64.toString()) || !isTextFile(file2Base64.toString())) {
//             return res.send(
//                 `<h1>Error: Files are not text files</h1>
//             ${FormPage()}`
//         );
//         }
//
//         const textFromFile1 = Buffer.from(file1Base64, 'base64').toString('utf-8');
//         const textFromFile2 = Buffer.from(file2Base64, 'base64').toString('utf-8');
//
//         const similarityScore = calculateSimilarity(textFromFile1, textFromFile2);
//
//         const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarityScore}`;
//
//         try {
//             await fs.promises.writeFile('Ответ на запрос.txt', resultText);
//             res.download('Ответ на запрос.txt');
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error saving the file');
//         }
//     } else {
//         res.status(405).send('Method Not Allowed');
//     }
// });
app.all('/', upload.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === 'GET') {
        res.send((0, helpers_1.FormPage)());
    }
    else if (req.method === 'POST') {
        const { text } = req.body;
        // const file1Buffer = (req.files['file1'][0] as Express.Multer.File).buffer;
        // const file2Buffer = (req.files['file2'][0] as Express.Multer.File).buffer;
        const file1 = req.files['file1'];
        const file2 = req.files['file2'];
        // if (!text || !file1Buffer || !file2Buffer) {
        //     return res.send(
        //         `<h1>Error: Missing fields</h1>
        //     ${FormPage()}`
        // );
        // }
        // if (!text || !file1Buffer || !file2Buffer) {
        //     return res.send(
        //         `${FormPage()}
        //         <h1>Error: Missing fields</h1>`
        // );
        // }
        if (!text || !file1 || !file1[0] || !file1[0].buffer || !file2 || !file2[0] || !file2[0].buffer) {
            return res.send(`<div style="display: flex; flex-direction: column; align-items: center;">
            <div id="error-message" style="border: 5px solid red; padding: 10px; margin-top: 10px;">Error: Missing fields</div>
        </div>
        ${(0, helpers_1.FormPage)()}
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const errorMessage = document.getElementById('error-message');
                errorMessage.innerText = 'Error: Files are not text files';
            });
        </script>
`);
        }
        const file1Buffer = file1[0].buffer;
        const file2Buffer = file2[0].buffer;
        const textFromFile1 = file1Buffer.toString('utf-8');
        const textFromFile2 = file2Buffer.toString('utf-8');
        const similarityScore = (0, helpers_1.calculateSimilarity)(textFromFile1, textFromFile2);
        const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarityScore};`;
        try {
            yield fs.promises.writeFile('Ответ на запрос.txt', resultText);
            res.download('Ответ на запрос.txt');
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error saving the file');
        }
    }
    else {
        res.status(405).send('Method Not Allowed');
    }
}));
app.all('/api', ((req, res) => {
    try {
        if (req.method === 'GET') {
            res.json((0, helpers_1.JsonResponse)());
        }
        else if (req.method === 'POST') {
            const jsonData = req.body;
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
        }
    }
    catch (e) {
        res.status(405).send('Method Not Allowed');
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
exports.default = app;
