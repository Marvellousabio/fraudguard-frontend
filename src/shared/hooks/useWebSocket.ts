import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import type { FlaggedTransaction } from '@/shared/types/transaction'

interface UseWebSocketOptions {
  onFraudDetected: (tx: FlaggedTransaction) => void
  onAiExplanationUpdated: (data: { transactionId: string; aiExplanation: string }) => void
  url?: string
}

export function useWebSocket({ onFraudDetected, onAiExplanationUpdated, url = 'http://localhost:3000' }: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false,
    })

    socket.on('connect', () => {
      reconnectAttemptsRef.current = 0
    })

    socket.on('fraud.detected', (tx: FlaggedTransaction) => {
      onFraudDetected(tx)
    })

    socket.on('ai_explanation.updated', onAiExplanationUpdated)

    socket.on('disconnect', () => {
      const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
      reconnectAttemptsRef.current++
      reconnectTimeoutRef.current = window.setTimeout(() => connect(), timeout)
    })

    socketRef.current = socket
  }, [url, onFraudDetected, onAiExplanationUpdated])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    socketRef.current?.disconnect()
    socketRef.current = null
  }, [])

  const sendFilter = useCallback((filter: { ruleType?: string; minRiskScore?: number; zoneId?: string }) => {
    socketRef.current?.emit('client:filter', filter)
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return { connect, disconnect, sendFilter, isConnected: socketRef.current?.connected ?? false }
}
