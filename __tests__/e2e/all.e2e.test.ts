// // @ts-ignore
// import request from 'supertest'
// import app from './main.ts';
// import {describe, it} from "node:test";
// import { expect } from 'chai';
// import natural from "natural";
// import {JsonResponse} from "../../helpers";
//
// describe('GET /', () => {
//     it('should return the form page', async () => {
//         const response = await request(app).get('/');
//
//         expect(response.status).to.equal(200);
//         expect(response.header['content-type']).to.match(/html/);
//         expect(response.text).to.include('<title>Form Page</title>');
//         expect(response.text).to.include('<h1>Form Page</h1>');
//         expect(response.text).to.include('<form');
//         expect(response.text).to.include('id="textInput"');
//         expect(response.text).to.include('id="fileInput1"');
//         expect(response.text).to.include('id="fileInput2"');
//         expect(response.text).to.include('<button type="submit">Submit</button>');
//     });
// });
// ///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// jest.mock('fs', () => ({
//     promises: {
//         writeFile: jest.fn(),
//     },
// }));
//
// describe('POST /', () => {
//     it('should return error for missing fields', async () => {
//         const response = await request(app)
//             .post('/')
//             .field('text', 'Example text')
//             .expect(200);
//
//         expect(response.text).toContain('<h1>Error: Missing fields</h1>');
//     });
//
//     it('should return error for non-text files', async () => {
//         const file1 = Buffer.from('binarydata1');
//         const file2 = Buffer.from('binarydata2');
//
//         const response = await request(app)
//             .post('/')
//             .field('text', 'Example text')
//             .attach('file1', file1, 'file1.txt')
//             .attach('file2', file2, 'file2.txt')
//             .expect(200);
//
//         expect(response.text).toContain('<h1>Error: Files are not text files</h1>');
//     });
//
//     it('should calculate similarity and save result', async () => {
//         jest.spyOn(natural, 'TfIdf').mockImplementation(() => ({
//             addDocument: jest.fn(),
//             listTerms: jest.fn().mockReturnValue([{ term: 'term1' }, { term: 'term2' }]),
//             tfidf: jest.fn((term: string, docIndex: number) => (docIndex === 0 ? 1 : 0.5)),
//         }));
//
//         const response = await request(app)
//             .post('/')
//             .field('text', 'Example text')
//             .attach('file1', Buffer.from('text1'), 'file1.txt')
//             .attach('file2', Buffer.from('text2'), 'file2.txt')
//             .expect(200);
//
//         expect(fs.promises.writeFile).toHaveBeenCalledWith('Ответ на запрос.txt', expect.any(String));
//         expect(response.header['content-disposition']).toContain('attachment; filename="Ответ на запрос.txt"');
//     });
// });
//
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// describe('GET /api', () => {
//     it('should return JSON response with help and example fields', async () => {
//         const response = await request(app).get('/api').expect(200);
//
//         expect(response.body).toEqual(JsonResponse());
//         expect(response.body).toHaveProperty('help');
//         expect(response.body).toHaveProperty('example');
//         expect(typeof response.body.help).toBe('string');
//         expect(typeof response.body.example).toBe('object');
//     });
// });
//
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// describe('POST /api', () => {
//     it('should return JSON response with similarity score', async () => {
//         const postData = {
//             text: 'Example text',
//             file1: '0KHQvtC00LXRgNC20LjQvNC+0LUg0L/QtdGA0LLQvtCz0L4g0YTQsNC50LvQsC4=',
//             file2: '0KHQvtC00LXRgNC20LjQvNC+0LUg0LLRgtC+0YDQvtCz0L4g0YTQsNC50LvQsC4=',
//         };
//
//         const response = await request(app)
//             .post('/api')
//             .send(postData)
//             .expect(200);
//
//         expect(response.body).toHaveProperty('text', postData.text);
//         expect(response.body).toHaveProperty('similarity');
//         expect(response.body).toHaveProperty('result');
//
//
//         const similarityScore = response.body.similarity;
//         expect(typeof similarityScore).toBe('number');
//         expect(similarityScore).toBeGreaterThanOrEqual(0);
//         expect(similarityScore).toBeLessThanOrEqual(1); // Предположение, что similarityScore находится в диапазоне от 0 до 1
//     });
//
//     it('should return error for missing fields', async () => {
//         const incompleteData = {
//             file1: '0KHQvtC00LXRgNC20LjQvNC+0LUg0L/QtdGA0LLQvtCz0L4g0YTQsNC50LvQsC4=',
//             file2: '0KHQvtC00LXRgNC20LjQvNC+0LUg0LLRgtC+0YDQvtCz0L4g0YTQsNC50LvQsC4=',
//         };
//
//         const response = await request(app)
//             .post('/api')
//             .send(incompleteData)
//             .expect(400);
//
//         expect(response.body).toHaveProperty('error', 'Отсутствуют необходимые поля');
//     });
//
//     it('should return error for non-text files', async () => {
//         const invalidData = {
//             text: 'Example text',
//             file1: '0KHQvtC00LXRgNC20LjQvNC+0LUg0LLRgtC+0YDQvtCz0L4g0YTQsNC50LvQsC4=',
//             file2: 'someinvalidbase64string',
//         };
//
//         const response = await request(app)
//             .post('/api')
//             .send(invalidData)
//             .expect(400);
//
//         expect(response.body).toHaveProperty('error', 'Один или оба файла не являются текстовыми');
//     });
// });

