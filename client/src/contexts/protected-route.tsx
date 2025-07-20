import React from "react";
import { Redirect } from "wouter";
import { useAuth } from "../contexts/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// In wouter, the component takes children directly.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading spinner while the auth state is being determined
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, render the children passed to the component.
  // Otherwise, use <Redirect> to send the user to the login page.
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
