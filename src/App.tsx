import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppSelector } from "./hooks/redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ToastProvider } from "./components/custom/Toast";
import { TooltipProvider } from "./components/ui/tooltip";

import AuthLayout from "./layouts/auth.layout";
import AppSideBarLayout from "./layouts/app-sidebar.layout";
import SpaceLayout from "./layouts/space.layout";

import ProtectedRoute from "./components/custom/ProtectedRoute";

import OTPPage from "./pages/auth/otp-page";
import SignInPage from "./pages/auth/sign-in.page";
import SignUpPage from "./pages/auth/sign-up.page";
import SpacesPage from "./pages/space/spaces.page";
import BoardPage from "./pages/space/board.page";
import BacklogPage from "./pages/space/backlog.page";
import NotFoundPage from "./pages/not-found.page";
import UnauthorizedPage from "./pages/unauthorized.page";
import CreateSpacePage from "./pages/space/create-space.page";
import UpdateSpacePage from "./pages/space/update-space.page";

const queryClient = new QueryClient();

function RootRedirect() {
  const token = useAppSelector((state) => state.auth.token);
  return token ? (
    <Navigate to="/issue-tracker/spaces" replace />
  ) : (
    <Navigate to="/auth/sign-in" replace />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ToastProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Root redirect */}
                <Route path="/" element={<RootRedirect />} />

                {/* Auth routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route index element={<Navigate to="sign-in" replace />} />
                  <Route path="sign-in" element={<SignInPage />} />
                  <Route path="sign-up" element={<SignUpPage />} />
                  <Route path="otp" element={<OTPPage />} />
                </Route>

                {/* App routes — require authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/issue-tracker" element={<AppSideBarLayout />}>
                    <Route index element={<Navigate to="spaces" replace />} />
                    <Route path="spaces" element={<SpacesPage />} />
                    <Route path="spaces/create" element={<CreateSpacePage />} />
                    <Route
                      path="spaces/:spaceId/update"
                      element={<UpdateSpacePage />}
                    />

                    {/* Space detail routes */}
                    <Route path="spaces/:spaceId" element={<SpaceLayout />}>
                      <Route index element={<Navigate to="board" replace />} />

                      <Route path="board" element={<BoardPage />} />
                      <Route path="board/:ticketId" element={<BoardPage />} />
                      <Route path="backlog" element={<BacklogPage />} />
                      <Route
                        path="backlog/:ticketId"
                        element={<BacklogPage />}
                      />
                    </Route>
                  </Route>
                </Route>

                {/* Utility pages */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
