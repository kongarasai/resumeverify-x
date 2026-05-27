"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth.store";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

type SocketStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { namespace = "/", autoConnect = true } = options;
  const { token, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("disconnected");
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const nsUrl = namespace === "/" ? SOCKET_URL : `${SOCKET_URL}${namespace}`;

    const socket = io(nsUrl, {
      auth: { token },
      query: { userId: user?.id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socketRef.current = socket;
    setStatus("connecting");

    socket.on("connect", () => {
      setStatus("connected");
      setIsConnected(true);
      socket.emit("join_user_room", user?.id);
    });

    socket.on("disconnect", (reason) => {
      setStatus("disconnected");
      setIsConnected(false);
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      setStatus("error");
      setIsConnected(false);
      console.error("Socket connection error:", error.message);
    });

    socket.on("reconnect", (attempt) => {
      setStatus("connected");
      setIsConnected(true);
      console.log("Socket reconnected after", attempt, "attempts");
    });

    socket.on("reconnect_attempt", () => {
      setStatus("connecting");
    });

    socket.on("reconnect_failed", () => {
      setStatus("error");
    });
  }, [token, user?.id, namespace]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setStatus("disconnected");
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    if (handler) {
      socketRef.current?.off(event, handler);
    } else {
      socketRef.current?.removeAllListeners(event);
    }
  }, []);

  useEffect(() => {
    if (autoConnect && token && user?.id) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, token, user?.id, connect, disconnect]);

  return {
    socket: socketRef.current,
    status,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Hook for chat room socket
export function useChatSocket(conversationId: string) {
  const { socket, isConnected, emit, on, off } = useSocket({ namespace: "/chat" });
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState<string[]>([]);

  useEffect(() => {
    if (!isConnected || !conversationId) return;

    emit("join_conversation", conversationId);

    const removeMsg = on("new_message", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    const removeTyping = on("user_typing", ({ userId, name }: any) => {
      setTyping((prev) => Array.from(new Set([...prev, name])));
      setTimeout(() => setTyping((prev) => prev.filter((n) => n !== name)), 3000);
    });

    return () => {
      emit("leave_conversation", conversationId);
      if (typeof removeMsg === "function") removeMsg();
      if (typeof removeTyping === "function") removeTyping();
    };
  }, [isConnected, conversationId, emit, on]);

  const sendMessage = useCallback(
    (content: string, type = "text") => {
      emit("send_message", { conversationId, content, type });
    },
    [emit, conversationId]
  );

  const sendTyping = useCallback(() => {
    emit("typing", { conversationId });
  }, [emit, conversationId]);

  return { messages, typing, sendMessage, sendTyping, isConnected };
}
