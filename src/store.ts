import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GFireStore {
  firewall: boolean;
  changeFirewall: (status: boolean) => void;
}

interface USBDevice {
  id: string;
  name: string;
  state: "block" | "allow";
}
interface GUsbStore {
  usbStatus: boolean;
  connectedUsbs: USBDevice[];
  changeUsbStatus: (status: boolean) => void;
  setConnectedUsbs: (usbs: USBDevice[]) => void;
}
interface GNetworkStore {
  ssh: boolean;
  tor: boolean;
  torTimeout: boolean;
  torTimeoutTimestamp: number;
  changeSSH: (status: boolean) => void;
  runTorDisable: (status: boolean) => void;
  setTorTimeout: (status: boolean) => void;
}

export const useFirewallStore = create(
  persist<GFireStore>(
    (set) => ({
      firewall: false,
      changeFirewall: (status: boolean) => set(() => ({ firewall: status })),
    }),
    {
      name: "firewall-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useNetworkStore = create(
  persist<GNetworkStore>(
    (set) => ({
      ssh: false,
      tor: false,
      torTimeout: false,
      torTimeoutTimestamp: 0, // New property to store timestamp
      runTorDisable: (status: boolean) => set(() => ({ tor: status })),
      changeSSH: (status: boolean) => set(() => ({ ssh: status })),
      setTorTimeout: (status: boolean) => {
        set(() => ({ torTimeout: status }));
        if (status) {
          set(() => ({ torTimeoutTimestamp: Date.now() })); // Set timestamp when torTimeout is true
          setTimeout(() => {
            set(() => ({ torTimeout: false, torTimeoutTimestamp: 0 })); // Reset torTimeout and timestamp
          }, 10 * 60 * 1000); // 10 minutes timeout
        }
      },
    }),
    {
      name: "network-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUsbStore = create(
  persist<GUsbStore>(
    (set) => ({
      usbStatus: false,
      connectedUsbs: [],
      changeUsbStatus: (status: boolean) => set(() => ({ usbStatus: status })),
      setConnectedUsbs: (connUsbs: USBDevice[]) =>
        set(() => ({ connectedUsbs: connUsbs })),
    }),
    {
      name: "usb-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
