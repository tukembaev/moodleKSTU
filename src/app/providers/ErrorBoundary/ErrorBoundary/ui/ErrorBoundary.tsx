import React, { ErrorInfo, ReactNode, Suspense } from 'react';
import { Layout } from 'widgets/Layout';
import { ErrorWidget } from 'widgets/ErrorWidget';

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;
        if (hasError) {
            return (
                <Layout>
                    <Suspense fallback="">
                        <ErrorWidget />
                    </Suspense>
                </Layout>
            );
        }

        return children;
    }
}

export default ErrorBoundary;

