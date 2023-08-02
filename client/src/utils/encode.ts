export function encodeJsonToBase64(jsonData: object): string {
    let jsonString: string = JSON.stringify(jsonData);
    let base64String: string = btoa(jsonString);
    return base64String;
}

export function decodeBase64ToJson(base64String: string): object {
    let decodedString: string = atob(base64String);
    let jsonData: object = JSON.parse(decodedString);
    return jsonData;
}