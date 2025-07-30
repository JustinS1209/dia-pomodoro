"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GraphService, MsalService } from "@bosch-gs-bda-apps/msal-wrapper";
import { jwtDecode } from "jwt-decode";
import LoadingPage from "@/app/components/LoadingPage";

type AuthAppContext = {
  currentUser?: BrainUser;
  userPhoto?: string;
};

export interface BrainUser {
  displayName: string;
  givenName: string;
  userId: string;
  userInitials: string;
  userPrincipalName: string;
}

export const AuthContext = createContext<AuthAppContext>({});

const config = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID as string,
    authority: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
    knownAuthorities: [process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID],
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

const scopes = {
  scopes: {
    backend: ["api://33af1ee8-cdf9-4454-a8a6-927ce2a34902/full-access"],
    graph: ["profile", "Calendars.Read"],
  },
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<BrainUser>();
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    const token = (await MsalService.instance.getAccessToken(
      scopes.scopes.graph,
    )) as string;
    const decryptedToken = jwtDecode(token) as any;

    return {
      displayName: decryptedToken.name ?? "",
      givenName: decryptedToken.given_name || "",
      userId: decryptedToken.upn!.split("@")[0],
      userInitials: createInitials(decryptedToken.name),
      userPrincipalName: decryptedToken.upn,
    } as BrainUser;
  }

  function createInitials(userDisplayName: string) {
    return userDisplayName
      .split(" ")
      .slice(0, -1)
      .map((el) => el[0])
      .join("");
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Start the minimum loading time timer
      const minimumLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 2000),
      ); // 2 seconds

      // Start the actual loading process
      const loadingProcess = async () => {
        try {
          new MsalService(config as any, scopes);
        } catch (e) {
          // error => msal instance already defined
        }
        // await MsalService.instance.initialize();
        await MsalService.instance.handleRedirectPromise();
        const user = await fetchUser();
        setCurrentUser(user);

        try {
          const picture = await GraphService(
            MsalService.instance,
          ).fetchCurrentUserProfilePicture();
          setUserPhoto(picture);
        } catch (e) {
          new Error("User has no profile picture", { cause: e });
        }
      };

      // Wait for both the actual loading AND the minimum time
      await Promise.all([loadingProcess(), minimumLoadingTime]);

      setLoading(false);
    })();
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      userPhoto,
    }),
    [currentUser, userPhoto],
  );

  if (loading) {
    return <LoadingPage />; // 👈 Use the beautiful LoadingPage component
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {currentUser && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
