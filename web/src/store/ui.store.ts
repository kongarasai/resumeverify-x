import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  mobileNavVisible: boolean;
  activeModal: string | null;
  isPageLoading: boolean;
  theme: "dark" | "light";

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setMobileNavVisible: (visible: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setPageLoading: (loading: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  notificationDrawerOpen: false,
  mobileNavVisible: false,
  activeModal: null,
  isPageLoading: false,
  theme: "dark",

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),

  toggleNotificationDrawer: () =>
    set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),

  setMobileNavVisible: (visible) => set({ mobileNavVisible: visible }),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),

  setPageLoading: (loading) => set({ isPageLoading: loading }),

  setTheme: (theme) => set({ theme }),
}));
