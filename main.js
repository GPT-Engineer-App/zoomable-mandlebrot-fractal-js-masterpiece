import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [iterations, setIterations] = useState(50);
  const [colorScheme, setColorScheme] = useState("default");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Generate the Mandelbrot fractal
    const mandelbrot = generateMandelbrot(width, height, zoom, panX, panY, iterations);

    // Render the fractal using the selected color scheme
    renderFractal(ctx, mandelbrot, colorScheme);
  }, [zoom, panX, panY, iterations, colorScheme]);

  const handleZoom = (direction) => {
    setZoom(direction === "in" ? zoom * 1.5 : zoom / 1.5);
  };

  const handlePan = (dx, dy) => {
    setPanX(panX + dx);
    setPanY(panY + dy);
  };

  const handleIterationsChange = (e) => {
    setIterations(e.target.value);
  };

  const handleColorSchemeChange = (e) => {
    setColorScheme(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative">
        <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white p-4 rounded-md shadow-md">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleZoom("in")}>
            <i className="fas fa-plus"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleZoom("out")}>
            <i className="fas fa-minus"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePan(-10, 0)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePan(10, 0)}>
            <i className="fas fa-arrow-right"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePan(0, -10)}>
            <i className="fas fa-arrow-up"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handlePan(0, 10)}>
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-md shadow-md">
          <label htmlFor="iterations" className="block font-bold mb-2">
            Iterations:
          </label>
          <input type="range" id="iterations" min="10" max="200" value={iterations} onChange={handleIterationsChange} className="w-full" />
          <label htmlFor="color-scheme" className="block font-bold mb-2 mt-4">
            Color Scheme:
          </label>
          <select id="color-scheme" value={colorScheme} onChange={handleColorSchemeChange} className="w-full">
            <option value="default">Default</option>
            <option value="grayscale">Grayscale</option>
            <option value="rainbow">Rainbow</option>
          </select>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

function generateMandelbrot(width, height, zoom, panX, panY, iterations) {
  const mandelbrot = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const realPart = (x / width - 0.5) / zoom - panX;
      const imaginaryPart = (y / height - 0.5) / zoom - panY;
      let iteration = 0;
      let zReal = realPart;
      let zImag = imaginaryPart;

      while (iteration < iterations && zReal * zReal + zImag * zImag <= 4) {
        const tempReal = zReal * zReal - zImag * zImag + realPart;
        zImag = 2 * zReal * zImag + imaginaryPart;
        zReal = tempReal;
        iteration++;
      }

      const index = (y * width + x) * 4;
      mandelbrot[index] = (iteration * 255) / iterations;
      mandelbrot[index + 1] = (iteration * 255) / iterations;
      mandelbrot[index + 2] = (iteration * 255) / iterations;
      mandelbrot[index + 3] = 255;
    }
  }

  return mandelbrot;
}

function renderFractal(ctx, mandelbrot, colorScheme) {
  const imageData = new ImageData(mandelbrot, 800, 600);

  switch (colorScheme) {
    case "grayscale":
      // Apply grayscale color scheme
      break;
    case "rainbow":
      // Apply rainbow color scheme
      break;
    default:
      // Default color scheme
      break;
  }

  ctx.putImageData(imageData, 0, 0);
}
