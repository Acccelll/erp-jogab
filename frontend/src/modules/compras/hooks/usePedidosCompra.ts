import { useQuery } from '@tanstack/react-query';
import type { CompraFiltersData } from '../types';
import { fetchPedidoCompraById, fetchPedidosCompra } from '../services/compras.service';

export function usePedidosCompra(filters?: CompraFiltersData) {
  return useQuery({
    queryKey: ['compras-pedidos', filters],
    queryFn: () => fetchPedidosCompra(filters),
  });
}

export function usePedidoCompraDetails(pedidoId?: string) {
  return useQuery({
    queryKey: ['compras-pedido-detail', pedidoId],
    queryFn: () => fetchPedidoCompraById(pedidoId as string),
    enabled: Boolean(pedidoId),
  });
}
