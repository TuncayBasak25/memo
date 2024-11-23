interface GamePage {
    unload(): void;
  }
  
  function loadNormal(): GamePage {
  
    let score = 0;
    let timeLeft = 10;
    let usedIndexes = new Set<number>();
    let countdownInterval: number | null = null;
  
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.backgroundColor = "#f5f5f5";
    container.style.overflow = "hidden";
    document.body.appendChild(container);
  
    const scoreElement = document.createElement("div");
    scoreElement.style.fontSize = "24px";
    scoreElement.style.color = "#333";
    scoreElement.style.marginBottom = "20px";
    scoreElement.textContent = `Score: ${score}`;
    container.appendChild(scoreElement);
  
    const countdownElement = document.createElement("div");
    countdownElement.style.fontSize = "18px";
    countdownElement.style.color = "#333";
    countdownElement.style.marginBottom = "20px";
    countdownElement.textContent = `Time: ${timeLeft}s`;
    container.appendChild(countdownElement);
  
    const imageWrapper = document.createElement("div");
    imageWrapper.style.position = "relative";
    imageWrapper.style.width = "50vh";
    imageWrapper.style.height = "50vh";
    imageWrapper.style.display = "flex";
    imageWrapper.style.justifyContent = "center";
    imageWrapper.style.alignItems = "center";
    container.appendChild(imageWrapper);
  
    const imageElement = document.createElement("img");
    imageElement.style.width = "100%";
    imageElement.style.height = "100%";
    imageElement.style.objectFit = "cover";
    imageElement.style.borderRadius = "50%";
    imageWrapper.appendChild(imageElement);
  
    const page = new (class implements GamePage {
      private eventListeners: Array<() => void> = [];
  
      constructor() {
        this.loadNextRound();
      }
  
      unload(): void {
        if (countdownInterval !== null) clearInterval(countdownInterval);
        this.eventListeners.forEach((removeListener) => removeListener());
        this.eventListeners = [];
        document.body.removeChild(container);
      }
  
      private loadNextRound(): void {
        if (usedIndexes.size === wordVisuals.length) {
          this.showGameOverPage();
          return;
        }
  
        const currentIndex = this.getRandomIndex();
        usedIndexes.add(currentIndex);
        timeLeft = 10;
        imageElement.src = wordVisuals[currentIndex];
  
        if (countdownInterval !== null) clearInterval(countdownInterval);
        countdownInterval = window.setInterval(() => {
          timeLeft -= 1;
          countdownElement.textContent = `Time: ${timeLeft}s`;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval!);
            score -= 10;
            this.loadNextRound();
          }
        }, 1000);
  
        this.renderButtons(currentIndex);
      }
  
      private renderButtons(correctIndex: number): void {
        const randomNumbers = this.generateRandomNumbers(correctIndex);
  
        // Clear existing buttons
        imageWrapper.querySelectorAll("button").forEach((btn) => btn.remove());
  
        const imageRadius = parseFloat(imageWrapper.style.width) / 2; // Half of the image width
        const buttonRadius = imageRadius + 40; // Add 5px padding around the image
        const angleStep = (2 * Math.PI) / randomNumbers.length;
  
        randomNumbers.forEach((num, index) => {
          const angle = index * angleStep;
          const button = document.createElement("button");
  
          button.textContent = num.toString().padStart(2, "0");
          button.style.width = "100px";
          button.style.height = "100px";
          button.style.borderRadius = "50%";
          button.style.border = "none";
          button.style.cursor = "pointer";
          button.style.backgroundColor = "#007BFF";
          button.style.color = "#fff";
          button.style.fontSize = "30px";
          button.style.position = "absolute";
  
          // Positioning the button around the image
          const x = 50 + buttonRadius * Math.cos(angle);
          const y = 50 + buttonRadius * Math.sin(angle);
          button.style.left = `${x}%`;
          button.style.top = `${y}%`;
          button.style.transform = "translate(-50%, -50%)";
          button.style.transition = "background-color 0.3s";
  
          button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#0056b3";
          });
          button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#007BFF";
          });
          button.addEventListener("click", () => {
            if (num === correctIndex) {
              score += Math.max(1, timeLeft); // Score decreases with slowness
            } else {
              score -= 10;
            }
            scoreElement.textContent = `Score: ${score}`;
            this.loadNextRound();
          });
  
          imageWrapper.appendChild(button);
        });
      }
  
      private getRandomIndex(): number {
        let index: number;
        do {
          index = Math.floor(Math.random() * wordVisuals.length);
        } while (usedIndexes.has(index));
        return index;
      }
  
      private generateRandomNumbers(correctIndex: number): number[] {
        const numbers = new Set<number>();
        numbers.add(correctIndex);
  
        while (numbers.size < 6) {
          const num = Math.floor(Math.random() * wordVisuals.length);
          numbers.add(num);
        }
  
        return Array.from(numbers).sort(() => Math.random() - 0.5);
      }
  
      private showGameOverPage(): void {
        alert(`Game Over! Final Score: ${score}`);
        this.unload();
        loadMain(); // Assuming you have a `loadMain` function
      }
    })();
  
    return page;
  }
