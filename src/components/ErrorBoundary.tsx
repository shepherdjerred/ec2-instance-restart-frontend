import React from "react";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: ErrorBoundaryState) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1 className="title">Something went wrong.</h1>
          <h2 className="subtitle">Reload the page and try again.</h2>
        </>
      );
    }

    return this.props.children;
  }
}
