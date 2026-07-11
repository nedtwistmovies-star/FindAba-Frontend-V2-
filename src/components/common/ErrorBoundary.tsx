import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FindAba OS] Runtime Error:', error, errorInfo);
    // Here we could log to a production diagnostics table via Supabase if needed
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
              City OS Interrupted
            </h1>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              FindAba OS encountered a runtime exception. This has been logged for the city engineering team. You can try reloading the module or returning to the home screen.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Reload
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-left">
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">Technical Details</p>
                <pre className="text-[10px] font-mono text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl overflow-auto max-h-40">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
