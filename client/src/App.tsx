/** Clinical Field Notes style: the application shell always routes users back to a persistent study desk. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BankReview from "./pages/BankReview";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/bank-review" component={BankReview} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
