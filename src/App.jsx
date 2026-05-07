import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [chantiers, setChantiers] = useState([])

  // Vérifier la session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Interface non authentifié
  if (!session) {
    return (
      <div style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '2rem' }}>
        <h1>🏗️ ChantierSuivi</h1>
        <p>Suivez vos chantiers en temps réel, même depuis la diaspora</p>
        <form onSubmit={(e) => {
          e.preventDefault()
          const email = e.target.email.value
          const password = e.target.password.value
          supabase.auth.signInWithPassword({ email, password })
            .then(({ error }) => { if (error) alert('❌ ' + error.message) })
        }}>
          <input name="email" type="email" placeholder="Email" required 
            style={{ display: 'block', margin: '0.5rem auto', padding: '0.75rem', width: '80%' }} />
          <input name="password" type="password" placeholder="Mot de passe" required 
            style={{ display: 'block', margin: '0.5rem auto', padding: '0.75rem', width: '80%' }} />
          <button type="submit" 
            style={{ background: '#0056b3', color: 'white', border: 'none', padding: '0.75rem 2rem', 
                     borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
            Se connecter
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Pas de compte ? <a href="#" onClick={(e) => { e.preventDefault(); alert('Inscription à venir'); }}>Créer un compte</a>
        </p>
      </div>
    )
  }

  // Interface authentifié (simplifiée pour MVP)
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>🏗️ ChantierSuivi</h1>
        <button onClick={() => supabase.auth.signOut().then(() => setSession(null))}
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px' }}>
          Déconnexion
        </button>
      </header>
      
      <div style={{ background: '#e8f4fd', padding: '1rem', borderRadius: '8px' }}>
        <h2>🎉 Bienvenue !</h2>
        <p>Votre app ChantierSuivi est déployée avec succès 🚀</p>
        <p><strong>Email :</strong> {session.user.email}</p>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
        <p>🔧 Prochaines fonctionnalités :</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>✅ Authentification utilisateur</li>
          <li>⏳ Création de chantiers</li>
          <li>⏳ Upload photo géolocalisé</li>
          <li>⏳ Suivi budget temps réel</li>
          <li>⏳ Intégration KKiaPay</li>
        </ul>
      </div>
    </div>
  )
}

export default App
