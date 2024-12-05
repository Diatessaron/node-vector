import fs from "fs";
import { Transform } from "node:stream";

export class VectorService {
    vectorize(path: string) {
        if (!path || path.trim() === "") throw new Error("Path is required");

        let readStream = fs.createReadStream(path);

        const countFrequenciesTransformStream = new Transform({
            transform(chunk: any, encoding, callback) {
                const result = Object.values(Buffer.from(chunk).toString()
                    .split(/\s+/)
                    .map(word => word.replace(/[^\w]/g, ''))
                    .filter(word => word.length > 0)
                    .sort()
                    .reduce((acc, word) => {
                        acc[word] = (acc[word] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>)) as number[];

                this.push(JSON.stringify(result))
                callback()
            }
        });

        const writeStream = fs.createWriteStream("result.txt");

        readStream
            .pipe(countFrequenciesTransformStream)
            .pipe(writeStream)
            .on("finish", () => console.log("Processing complete. Output written to result.txt"));
    }
}
