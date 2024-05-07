export declare class JsonImporter<T> {
    jsonData1: any;
    constructor();
    getJSONData(path: string): Promise<T[]>;
    importJSONData(path: string): Promise<any>;
    private readFileAsync;
}
