"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || "Something went wrong.",
    };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      message: "",
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="mb-3 text-sm text-destructive">
            {this.state.message || "Unexpected UI error."}
          </p>
          <Button variant="outline" onClick={this.resetError}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
