import Link from 'next/link'

export default function Home() {
  return (
    <div className="homepage-container">
      <main className="content-wrapper">
        <h1 className="welcome-title">
          Welcome to the GraphQL Profile Project
        </h1>
        <div className="button-container">
          <Link href="/login" className="login-button">
            Login
          </Link>
        </div>
      </main>
    </div>
  )
}

