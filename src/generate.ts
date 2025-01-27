namespace Main {
    on_init(() => {
        const image = new Image(innerWidth / 8, innerWidth / 8);
        image.src = "images/cat.webp"
    
        image.style.position = "absolute";
        image.style.borderRadius = "500px"
        image.style.left = (innerWidth - image.width) / 2 + "px";
        image.style.top = (innerHeight - image.height) / 2 + "px";
    
        document.body.appendChild(image);
    
        window.onresize = () => {
            image.width = innerWidth / 8;
            image.height = innerWidth / 8;
            image.style.left = (innerWidth - image.width) / 2 + "px";
            image.style.top = (innerHeight - image.height) / 2 + "px";
        }

        let angle = 0;
        on_update(() => {
            angle += deltaT / 1000;
            image.style.transform = `rotate(${angle}rad)`;
        })
    })
}