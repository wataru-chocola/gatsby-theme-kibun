import React, { ErrorInfo } from 'react';

type ErrorBoundaryProps = React.PropsWithChildren<{
  fallback: React.ReactNode;
}>;
type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.groupCollapsed('Error at:');
    console.error(errorInfo.componentStack);
    console.groupEnd();
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
