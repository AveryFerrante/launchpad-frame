export class DataTranslator {
    getData(): object {
        const result = {};
        Object.keys(this).map(key => {
            if (key.toLowerCase() !== 'id') {
                result[key] = this[key];
            }
        });
        return result;
    }
}
