
//Listen any set of a property, accepts a function that takes the new value of type T in entry and returns the treated value by the user
function setListener<T, E, N extends keyof E>(
    entity: E & {[key in N]: T},
    property: N,
    listener: (newValue: T) => T
) {
    const metaData: { value?: T, listeners: ((newValue: T) => T)[]} = getMetaData(entity, "setListeners");
    if (!("value" in metaData)) {
        metaData.listeners = [];
        metaData.value = entity[property];
        Object.defineProperty(entity, property, {
            get: function() {
                return metaData.value;
            },
            set: function(newValue: T) {
                metaData.value = newValue;
                for (const listener of metaData.listeners)
                    metaData.value = listener(metaData.value);
            }
        });
    }
    metaData.listeners.push(listener);
}

class Person {
    name = ""
}

const person = new Person();

setListener(person, "name", (newName: string) => {
    console.log(`Name is changing to ${newName}Test`);
    return newName + "Test";
});

person.name += "Tuncay";

class Vec {
    x = 0;
    y = 0;
}

const pos = new Vec();

setListener(pos, "x", (newX: number) => newX > 15 ? 15 : newX);//Most simple max limiter

let i = 0;
while (i < 20) {
    console.log(`Pos(x: ${pos.x}, y: ${pos.y})`);
    pos.x++;
    pos.y++;
    i++;
}