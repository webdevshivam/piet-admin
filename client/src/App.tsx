import { Route, Switch } from "wouter";
import Layout from "./components/dashboard/layout";
import ProtectedRoute from "./contexts/protected-route";
import { AuthProvider } from "./contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import Banner from "./pages/banner";
import Cells from "./pages/cells";
import Dashboard from "./pages/dashboard";
import Faculty from "./pages/faculty";
import Gallery from "./pages/gallery";
import IPR from "./pages/ipr";
import Login from "./pages/login";
import Management from "./pages/management";
import News from "./pages/news";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

// This layout component is now a simple wrapper for our protected routes.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <Switch>
          {/* Public login route */}
          <Route path="/login" component={Login} />

          {/* All other routes are protected */}
          <Route>
            <ProtectedRoute>
              <DashboardLayout>
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/banner" component={Banner} />
                  <Route path="/faculty" component={Faculty} />
                  <Route path="/management" component={Management} />
                  <Route path="/news" component={News} />
                  <Route path="/gallery" component={Gallery} />
                  <Route path="/cells" component={Cells} />
                  <Route path="/ipr" component={IPR} />
                  <Route path="/profile" component={Profile} />
                  {/* Fallback for any unknown route inside the dashboard */}
                  <Route component={NotFound} />
                </Switch>
              </DashboardLayout>
            </ProtectedRoute>
          </Route>
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;