import React from 'react';
import { Icons } from './Icon';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0a15] text-slate-400 p-8">
                    <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
                        <Icons.X size={32} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Có lỗi xảy ra</h1>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
                        Ứng dụng gặp sự cố không mong muốn. Vui lòng thử tải lại trang.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Tải lại trang
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
