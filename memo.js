"use strict";
var Interceptor;
(function (Interceptor) {
    function setupInterceptor(entity, propertyName) {
        const metaData = MetaData.get(entity, propertyName, { value: entity[propertyName], limiters: [], watchers: [] });
        let mutex = false; //Check if there is already a mutation to prevent cycle call to set propertyname, we will throw an error to constrain good practice of not trying to set a property inside its set interceptor
        Object.defineProperty(entity, propertyName, {
            get: function () {
                return metaData.value;
            },
            set: function (newValue) {
                if (mutex)
                    throw new Error("You are trying to mutate the property inside the property set interceptor! Return your value in the limiter function if you want to mutate!");
                if (newValue == metaData.value) //No change no trigger
                    return;
                mutex = true; //From there something like entity.gold += 5 will trigger runtime error with an error message, maybe we can build a more complete logging system
                //In the futur we will manage to get rid of those checks with static analysis
                for (const limiter of metaData.limiters) {
                    newValue = limiter(newValue);
                    if (newValue == metaData.value) { //One of limiters has constrained the value to stay the same, so no change
                        mutex = false;
                        return;
                    }
                }
                //To be here means the value has effectively changed
                for (const watcher of metaData.watchers)
                    watcher(newValue); //To handle a function call with the new value, the entity.value is still unchanged so the user can compare it if he wish
                metaData.value = newValue; //Finally we set the value of the property
                mutex = false; //The value can be reset if wished, this pervents calling set value inside set value by throwing runtime error, but technically we could get rid of it at distribution as the code will not change in distribution
            }
        });
        return metaData; //We return the metaData so the registerers can use it as they wish
    }
    function limitProperty(entity, propertyName, limiter) {
        const metaData = setupInterceptor(entity, propertyName);
        metaData.limiters.push(limiter);
        return () => metaData.limiters = metaData.limiters.filter(el => el != limiter); //Cleaner if needed
    }
    Interceptor.limitProperty = limitProperty;
    function watchProperty(entity, propertyName, watcher) {
        const metaData = setupInterceptor(entity, propertyName);
        metaData.watchers.push(watcher);
        return () => metaData.watchers = metaData.watchers.filter(el => el != watcher);
    }
    Interceptor.watchProperty = watchProperty;
})(Interceptor || (Interceptor = {}));
setTimeout(() => {
    class Vec {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.name = "";
        }
    }
    const vec = new Vec();
    Interceptor.watchProperty(vec, "x", (newValue) => console.log("Vec x is about to change to " + newValue));
    vec.x++;
}, 0);
var MetaData;
(function (MetaData) {
    const register = new WeakMap();
    function get(entity, name, initialValue) {
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
    MetaData.get = get;
})(MetaData || (MetaData = {}));
