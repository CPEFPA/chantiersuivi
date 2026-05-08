import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)
  
  return React.createElement("div", { style: { fontFamily: "system-ui", textAlign: "center", padding: "2rem" } },
    React.createElement("h1", null, "??? ChantierSuivi"),
    React.createElement("p", null, "? App d?ploy?e avec succ?s !"),
    React.createElement("button", { 
      onClick: () => setCount(c => c + 1),
      style: { background: "#0056b3", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer", marginTop: "1rem" }
    }, "Compteur : " + count)
  )
}

export default App