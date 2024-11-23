namespace MetaData {
    const register = new WeakMap<object, { [key: string]: any }>();
    export function get<T>(entity: object, name: string, initialValue: T): T {
        let data = register.get(entity);
        if (!data) {
            data = {};
            register.set(entity, data);
        }
        if (!(name in data)) {
            data[name] = initialValue;
        }
        return data[name];
    }
}