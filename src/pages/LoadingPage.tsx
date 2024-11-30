function LoadingPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 vw-100 bg-gradient">
      <div className="lds-ripple"><div></div><div></div></div>
      <div className="h1 m-0 p-0">Loading ...</div>
    </div>
  )
}

export default LoadingPage