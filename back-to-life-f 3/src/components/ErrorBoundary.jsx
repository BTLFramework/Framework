import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PatientModal Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "fixed",
          inset: "0",
          zIndex: "50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
              Patient Modal Error
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              Unable to display patient details. Please try refreshing the page.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={this.props.onClose}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  cursor: "pointer"
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 