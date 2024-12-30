// Create a class for the element
class WhiskeyKineticsElement extends HTMLElement {
  constructor() {
    super();

    // Get mandatory attributes
    this.workerPath = this.getAttribute("data-worker");
    this.width = this.getAttribute("width");
    this.height = this.getAttribute("height");

    // Get custom attributes
    this.wkAttributes = this.getAttributeNames()
      .filter((e) => e.startsWith("data-attr-"))
      .reduce((pre, cur) => ({ ...pre, [cur.slice(10)]: this.getAttribute(cur) }), {});

    // Create Shadow DOM
    this.attachShadow({ mode: "open" });

    // Add content
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        canvas {
          max-width: 100%;
        }

        .loading .loader {
          display: block;
        }

        .loading canvas {
          opacity: 0.1;
        }

        .loading .progress-bar-wrapper {
          display: block;
        }

        .progress-bar-wrapper {
          display: none;
          position: absolute;
          height: 8px;
          width: 100px;
          left: 50%;
          top: 50%;
          margin-left: -50px;
          margin-top: -4px;
          background-color: #bbbbbb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 1px;
          background-color: #636363;
          transition: width 0.2s;
        }
      </style>
      <div class="canvas-wrapper loading">
        <canvas width="${this.width}" height="${this.height}"></canvas>
        <div class="progress-bar-wrapper">
          <div class="progress-bar"></div>
        </div>
      </div>`;

    // Create web worker that does the calculation of all frames
    this.worker = new Worker(this.workerPath, { type: "module" });

    // Start simulation
    this.worker.postMessage(this.wkAttributes);
  }

  async connectedCallback() {
    const module = await import(this.workerPath);

    // Draw calculated frames
    this.worker.onmessage = async (e) => {
      // Draw progress bar
      if (e.data.progress) {
        this.shadowRoot.querySelector(".progress-bar").style.width = e.data.progress * 200 + "px";
        return;
      }

      // Hide progress bar and draw frames
      this.shadowRoot.querySelector(".canvas-wrapper").classList.remove("loading");
      this.shadowRoot.querySelector(".progress-bar").style.width = "1px";
      const start = Date.now();
      const animateFrame = () => {
        const frameIndex = Math.floor(((Date.now() - start) / 1000) * e.data.fps);
        module.draw(this.shadowRoot.querySelector("canvas").getContext("2d"), frameIndex, e.data);
        window.requestAnimationFrame(animateFrame);
      };
      animateFrame();
    };
  }
}

customElements.define("whiskey-kinetics", WhiskeyKineticsElement);
