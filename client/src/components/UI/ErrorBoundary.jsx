import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error to a service
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-500">Something went wrong.</div>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary; 