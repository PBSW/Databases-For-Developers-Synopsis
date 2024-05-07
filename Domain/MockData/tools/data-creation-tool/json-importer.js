import * as fs from 'fs';
export class JsonImporter {
    jsonData1;
    constructor() {
        this.jsonData1 = {};
    }
    async getJSONData(path) {
        return await this.importJSONData(path);
    }
    async importJSONData(path) {
        try {
            const file1Data = await this.readFileAsync(path);
            return JSON.parse(file1Data);
        }
        catch (error) {
            console.error("Error importing JSON files:", error);
        }
    }
    readFileAsync(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
