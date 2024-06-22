"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSimilarity = exports.isTextFile = exports.JsonResponse = exports.FormPage = void 0;
const natural_1 = __importDefault(require("natural"));
// export const FormPage = (): string =>
//    `
//  <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Form Page</title>
//       </head>
//        <body>
//           <h1>Form Page</h1>
//             <form method="POST" action="/" enctype="multipart/form-data">
//                <input type="text" name="text">
//                <input type="file" name="file1">
//                <input type="file" name="file2">
//                <button type="submit">Submit</button>
//             </form>
//        </body>
//     </html>
// `;
const FormPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }

        h1 {
            text-align: center;
            color: #333;
        }

        form {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input[type="text"], input[type="file"], button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        button {
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Form Page</h1>
    <form method="POST" action="/" enctype="multipart/form-data">
        <input type="text" id="textInput" name="text" placeholder="Enter text">
        <input type="file" id="fileInput1" name="file1">
        <input type="file" id="fileInput2" name="file2">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
`;
exports.FormPage = FormPage;
const JsonResponse = () => ({
    help: "Отправьте запрос с данными. Файлы кодируйте в Base64.",
    example: {
        text: "Текстовая строка",
        file1: "0KHQvtC00LXRgNC20LjQvNC+0LUg0L/QtdGA0LLQvtCz0L4g0YTQsNC50LvQsC4=",
        file2: "0KHQvtC00LXRgNC20LjQvNC+0LUg0LLRgtC+0YDQvtCz0L4g0YTQsNC50LvQsC4="
    }
});
exports.JsonResponse = JsonResponse;
const isTextFile = (data) => {
    if (data.includes('\u0000')) {
        return false;
    }
    return true;
};
exports.isTextFile = isTextFile;
// export const calculateSimilarity = (text1: string, text2: string): number => {
//     const words1: Set<string> = new Set(text1.split(' '));
//     const words2: Set<string> = new Set(text2.split(' '));
//
//     const intersection: Set<string> = new Set([...words1].filter((word) => words2.has(word)));
//     const union: Set<string> = new Set([...words1, ...words2]);
//
//     const similarityScore: number = intersection.size / union.size;
//
//     return similarityScore;
// };
const calculateSimilarity = (text1, text2) => {
    const tfidf = new natural_1.default.TfIdf();
    tfidf.addDocument(text1);
    tfidf.addDocument(text2);
    let similarityScore = 0;
    const terms1 = tfidf.listTerms(0).map(term => term.term);
    const terms2 = tfidf.listTerms(1).map(term => term.term);
    terms1.forEach((term) => {
        const tfidf1 = tfidf.tfidf(term, 0);
        const tfidf2 = tfidf.tfidf(term, 1);
        similarityScore += tfidf1 * tfidf2;
    });
    const magnitude1 = Math.sqrt(terms1.reduce((acc, term) => acc + Math.pow(tfidf.tfidf(term, 0), 2), 0));
    const magnitude2 = Math.sqrt(terms2.reduce((acc, term) => acc + Math.pow(tfidf.tfidf(term, 1), 2), 0));
    similarityScore /= (magnitude1 * magnitude2);
    return similarityScore;
};
exports.calculateSimilarity = calculateSimilarity;
