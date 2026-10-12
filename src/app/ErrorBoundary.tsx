import { Component, type ReactNode } from 'react';

interface State {
  error?: Error;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="main">
          <div className="empty">
            <h3>Something went wrong</h3>
            <p>{this.state.error.message}</p>
            <button className="btn primary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
