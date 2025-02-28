import { useState } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import "./styles.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleShorten = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/shorten", { url: longUrl });
      setShortUrl(response.data.shortUrl);
      setError(null);
    } catch (err) {
      setError("Error shortening URL");
    }
  };

  return (
    <div className="container">
      <h2>Link Shortener</h2>
      <input 
        type="text" 
        placeholder="Enter URL" 
        value={longUrl} 
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <button onClick={handleShorten}>Shorten</button>
      {shortUrl && (
        <div>
          <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <QRCode value={shortUrl} />
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
