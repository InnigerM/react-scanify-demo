import { useEffect, useRef, useState } from 'react';

export const Scanner = () => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [loadedOpenCV, setLoadedOpenCV] = useState(false);
  const openCvURL = 'https://docs.opencv.org/4.7.0/opencv.js';

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const scanner = new jscanify();
    loadOpenCv(() => {
      const newImg = document.createElement('img');
      newImg.src = imgRef.current.src;

      newImg.onload = function () {
        const resultCanvas = scanner.extractPaper(newImg, 386, 500);
        containerRef.current.append(resultCanvas);

        const highlightedCanvas = scanner.highlightPaper(newImg);
        containerRef.current.append(highlightedCanvas);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOpenCv = (onComplete) => {
    const isScriptPresent = !!document.getElementById('open-cv');
    if (isScriptPresent || loadedOpenCV) {
      setLoadedOpenCV(true);
      onComplete();
    } else {
      const script = document.createElement('script');
      script.id = 'open-cv';
      script.src = openCvURL;

      script.onload = function () {
        setTimeout(function () {
          onComplete();
        }, 1000);
        setLoadedOpenCV(true);
      };
      document.body.appendChild(script);
    }
  };

  return (
    <>
      {!loadedOpenCV && (
        <div>
          <h2>Loading OpenCV...</h2>
        </div>
      )}
      <img ref={imgRef} src="/paper-high.png" alt="Piece of paper on a table" />
      <div ref={containerRef} id="result-container"></div>
    </>
  );
};
