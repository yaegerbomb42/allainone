'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import logger from '@/lib/services/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="w-full max-w-md shadow-xl border-destructive/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">Oops! Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Don&apos;t worry, your data is safe.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-muted rounded-lg text-left text-xs font-mono overflow-auto max-h-32 border border-border">
                  {this.state.error.toString()}
                </div>
              )}

              <Button 
                onClick={this.handleReset}
                className="w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
