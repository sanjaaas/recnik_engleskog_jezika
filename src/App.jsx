import './App.css'
import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  async function searchWord(word) {
    setQuery(word)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      if (!res.ok) throw new Error('Reč nije pronađena')
      const data = await res.json()
      setResult(data[0])
      setHistory((prev) => [word, ...prev.filter((w) => w !== word)].slice(0, 5))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    if (query.trim()) searchWord(query)
  }

  const audioUrl = result?.phonetics.find((p) => p.audio)?.audio

  function playAudio() {
    if (audioUrl) new Audio(audioUrl).play()
  }

  return (
    <div className="app">
      <h1>Rečnik engleskog jezika</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Unesi reč"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Pretraži</button>

      {history.length > 0 && (
        <div className="history">
          <span>Nedavno:</span>
          {history.map((word) => (
            <button key={word} className="history-item" onClick={() => searchWord(word)}>
              {word}
            </button>
          ))}
          <button className="history-clear" onClick={() => setHistory([])}>
          x
          </button>
        </div>
      )}

      {loading && <p>Učitavanje...</p>}
      {error && <p>{error}</p>}

      {result && (
        <div className="result">
          <h2>{result.word}</h2>
          {result.phonetic && <p className="phonetic">{result.phonetic}</p>}
          {audioUrl && <button onClick={playAudio}>Izgovor</button>}

          {result.meanings.map((meaning, i) => (
            <div key={i} className="meaning">
              <h3>{meaning.partOfSpeech}</h3>
              <ol>
                {meaning.definitions.map((def, j) => (
                  <li key={j}>
                    {def.definition}
                    {def.example && <div className="example">"{def.example}"</div>}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App