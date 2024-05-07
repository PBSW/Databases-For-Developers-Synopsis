import * as fs from 'fs';

export class JsonImporter<T> {
    jsonData1: any;


    constructor() {
        this.jsonData1 = {};
    }

    public async getJSONData(path: string): Promise<T[]>  {
        return await this.importJSONData(path) as Promise<T[]>;
    }


    async importJSONData(path: string) {
        try {
            const file1Data = await this.readFileAsync(path);
            return JSON.parse(file1Data);
        } catch (error) {
            console.error("Error importing JSON files:", error);
        }
    }

    private readFileAsync(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}