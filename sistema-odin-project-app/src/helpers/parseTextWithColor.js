export default function parseTextWithColor(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g); 
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="text-title-active-static">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part; 
    });
  }