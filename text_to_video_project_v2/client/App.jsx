import { useState } from 'react';
import axios from 'axios';

const presets = [
  { label: 'Cartoons', value: 'cartoon' },
  { label: 'Product Demo', value: 'product' },
  { label: 'Realistic', value: 'realistic' }
];
const voices = ['Joanna', 'Matthew', 'Amy'];

function App() {
  const [text, setText] = useState('');
  const [avatar, setAvatar] = useState('');
  const [domainPreset, setDomainPreset] = useState(presets[0].value);
  const [ttsVoice, setTtsVoice] = useState(voices[0]);
  const [status, setStatus] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('/api/video', { text, avatarImage: avatar, domainPreset, ttsVoice });
    pollStatus(data.statusEndpoint);
  };

  const pollStatus = (endpoint) => {
    const interval = setInterval(async () => {
      const { data } = await axios.get(endpoint);
      setStatus(data.state);
      setProgress(data.progress);
      if (data.state === 'completed') {
        clearInterval(interval);
        setVideoSrc(data.result.outputPath);
      } else if (data.state === 'failed') {
        clearInterval(interval);
        alert('Generation failed');
      }
    }, 2000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Enhanced Text-to-Video Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea rows={4} className="w-full p-2 border" value={text}
          onChange={e => setText(e.target.value)} placeholder="Describe your video..." />
        <input type="text" className="w-full p-2 border mt-2" value={avatar}
          onChange={e => setAvatar(e.target.value)} placeholder="Avatar image URL (optional)" />
        <select className="w-full p-2 border mt-2" value={domainPreset}
          onChange={e => setDomainPreset(e.target.value)}>
          {presets.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select className="w-full p-2 border mt-2" value={ttsVoice}
          onChange={e => setTtsVoice(e.target.value)}>
          {voices.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Generate
        </button>
      </form>
      {status && <p>Status: {status}</p>}
      {progress >= 0 && <progress className="w-full" value={progress} max="100">{progress}%</progress>}
      {videoSrc && (
        <video controls className="mt-4 w-full max-w-lg">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default App;
