// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StringifyOptions } from "querystring";
import React, { useContext, useState, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export interface Meeting {
  uuid: string;
  name: string;
  region: string;
  topic: string;
}

interface AppStateValue {
  meetingArray: Meeting[];
  meetingId: string;
  localUserName: string;
  theme: string;
  region: string;
  refresh: boolean;
  toggleTheme: () => void;
  setAppMeetingInfo: (
    meetingArray: Meeting[],
    meetingId: string,
    name: string,
    region: string,
    refresh: boolean
  ) => void;
}

const AppStateContext = React.createContext<AppStateValue | null>(null);

export function useAppState(): AppStateValue {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return state;
}

const query = new URLSearchParams(window.location.search);

export function AppStateProvider({ children }: Props) {
  const [meetingId, setMeeting] = useState("");
  const [meetingArray, setMeetingArray] = useState<Meeting[]>([]);
  const [region, setRegion] = useState(query.get("region") || "");
  const [localUserName, setLocalName] = useState("");
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || "light";
  });
  const [refresh, setRefresh] = useState(false);

  const toggleTheme = (): void => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  const setAppMeetingInfo = (
    meetingArray: {
      uuid: string;
      name: string;
      region: string;
      topic: string;
    }[],
    meetingId: string,
    name: string,
    region: string,
    refresh: boolean
  ) => {
    setRegion(region);
    setMeeting(meetingId);
    setLocalName(name);
    setMeetingArray(meetingArray);
    setRefresh(refresh);
  };

  const providerValue = {
    meetingArray,
    meetingId,
    localUserName,
    theme,
    region,
    refresh,
    toggleTheme,
    setAppMeetingInfo,
  };

  return (
    <AppStateContext.Provider value={providerValue}>
      {children}
    </AppStateContext.Provider>
  );
}
