"use client";

import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GraphService, MsalService } from "@bosch-gs-bda-apps/msal-wrapper";
import getConfig from "next/config";
import { ResponseType } from "@microsoft/microsoft-graph-client";
// import { Loader } from "@/features/common/components/Loader";

// const { publicRuntimeConfig } = getConfig();

type AuthAppContext = {
  currentUser?: BrainUser;
  userPhoto?: string;
  getAccessToken?: string;
};

export interface BrainUser {
  displayName: string;
  givenName: string;
  userId: string;
  userInitials: string;
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

console.log(config);

const scopes = {
  scopes: {
    backend: ["api://dia-brain/full-access"],
    graph: ["profile", "User.ReadBasic.All", "Files.Read.All"],
  },
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<BrainUser>();
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    console.log("test");
    return await MsalService.instance.graph({
      endpoint: "me",
      responseType: ResponseType.JSON,
    });
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
      try {
        new MsalService(config as any, scopes);
      } catch (e) {
        // error => msal instance already defined
      }
      // await MsalService.instance.initialize();
      await MsalService.instance.handleRedirectPromise();
      const user = await fetchUser();
      setCurrentUser({
        displayName: user.displayName ?? "",
        givenName: user.givenName || "",
        userId: user.userPrincipalName!.split("@")[0],
        userInitials: createInitials(user.displayName ?? ""),
      });

      try {
        const picture = await GraphService(
          MsalService.instance,
        ).fetchCurrentUserProfilePicture();
        setUserPhoto(picture);
      } catch (e) {
        new Error("User has no profile picture", { cause: e });
      } finally {
        setLoading(false);
      }
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
    // return <Loader />;
    return "TODO Loading...";
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {currentUser && children}
    </AuthContext.Provider>
  );
}
