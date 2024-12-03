import fs from "fs";
import { VectorService } from "../src/VectorService";
import { Transform } from "node:stream";

describe("Vector Script", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("Should correctly parse file", (done) => {
        [
            { input: "a c b b", result: "[1,2,1]" },
            { input: "ab cb bss b", result: "[1,1,1,1]" },
            { input: "ab, cb, bss, cb, b, cb", result: "[1,1,1,3]" },
            { input: "alex, alex, juan, dima", result: "[2,1,1]" }
        ].forEach((source) => {
            const input = source.input;
            const expectedResult = source.result;

            jest.mock('fs');

            const readStream = new Transform({
                transform(chunk, encoding, callback) {
                    callback(null, chunk);
                },
            });
            const writeStream = new Transform({
                transform(chunk, encoding, callback) {
                    const result = chunk.toString();
                    expect(result).toBe(expectedResult);
                    callback();
                },
            });

            fs.createReadStream = jest.fn().mockReturnValue(readStream);
            fs.createWriteStream = jest.fn().mockReturnValue(writeStream);

            setTimeout(() => {
                readStream.emit('data', input);
                readStream.emit('end');
            });

            new VectorService().vectorize("file.txt")

            writeStream.on('finish', () => {
                done();
            });
        })
    });

    test("Should throw an exception when path is not provided", () => {
        expect(() => {
            new VectorService().vectorize("")
        }).toThrow("Path is required");
    });
});
