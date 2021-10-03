import React, { ErrorInfo } from 'react';

type ErrorBoundaryProps = React.PropsWithChildren<{
  fallback: React.ReactNode;
  errHandler?: (error: Error, errorInfo: ErrorInfo) => void;
}>;
type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.groupCollapsed('Error at:');
    console.error(errorInfo.componentStack);
    console.groupEnd();
    if (this.props.errHandler) {
      this.props.errHandler(error, errorInfo);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
