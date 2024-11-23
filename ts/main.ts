class Page {
    private eventListeners: Array<() => void> = [];

    constructor() {
        document.body.innerHTML = "";
    }

    setEventListener(
        element: HTMLElement,
        event: string,
        handler: (e: Event) => void
    ): void {
        element.addEventListener(event, handler);
        this.eventListeners.push(() => element.removeEventListener(event, handler));
    }

    unload(): void {
        this.eventListeners.forEach((removeListener) => removeListener());
        this.eventListeners = [];
        document.body.innerHTML = "";
    }
}

function loadMain(): Page {
    const page = new Page();

    // Create main container
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100vh";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.backgroundColor = "#f5f5f5";

    // Create heading
    const heading = document.createElement("h1");
    heading.innerText = "Memo Game";
    heading.style.color = "#333";
    heading.style.marginBottom = "20px";

    // Create game mode selection
    const modeContainer = document.createElement("div");
    modeContainer.style.display = "flex";
    modeContainer.style.gap = "10px";
    modeContainer.style.marginBottom = "20px";

    const normalMode = document.createElement("button");
    normalMode.innerText = "Normal";
    normalMode.style.padding = "10px 20px";
    normalMode.style.border = "none";
    normalMode.style.borderRadius = "5px";
    normalMode.style.cursor = "pointer";
    normalMode.style.backgroundColor = "#007BFF";
    normalMode.style.color = "#fff";

    const advancedMode = document.createElement("button");
    advancedMode.innerText = "Advanced";
    advancedMode.style.padding = "10px 20px";
    advancedMode.style.border = "none";
    advancedMode.style.borderRadius = "5px";
    advancedMode.style.cursor = "pointer";
    advancedMode.style.backgroundColor = "#6C757D";
    advancedMode.style.color = "#fff";

    modeContainer.appendChild(normalMode);
    modeContainer.appendChild(advancedMode);

    // Create start button
    const startButton = document.createElement("button");
    startButton.innerText = "Start Game";
    startButton.style.padding = "15px 30px";
    startButton.style.border = "none";
    startButton.style.borderRadius = "5px";
    startButton.style.cursor = "pointer";
    startButton.style.backgroundColor = "#28A745";
    startButton.style.color = "#fff";

    // Add elements to the container
    container.appendChild(heading);
    container.appendChild(modeContainer);
    container.appendChild(startButton);
    document.body.appendChild(container);

    // Add event listeners
    page.setEventListener(normalMode, "click", () => {
        normalMode.style.backgroundColor = "#007BFF";
        advancedMode.style.backgroundColor = "#6C757D";
    });

    page.setEventListener(advancedMode, "click", () => {
        advancedMode.style.backgroundColor = "#007BFF";
        normalMode.style.backgroundColor = "#6C757D";
    });

    page.setEventListener(startButton, "click", () => {
        page.unload();
        loadNormal();
    });

    return page;
}
