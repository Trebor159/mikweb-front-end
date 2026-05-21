import { useState, useEffect, useCallback } from 'react'

// Hook genérico para buscar dados da API com loading e erro
export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    try {
      setIsLoading(true)
      setErro(null)
      const resultado = await fn()
      setData(resultado)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao carregar dados'
      setErro(msg)
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { buscar() }, [buscar])

  return { data, isLoading, erro, refetch: buscar }
}
