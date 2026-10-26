import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Quote, Order } from '../../types';
import { Check, ArrowRight } from 'lucide-react';

export const QuotesOrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const { hasRole } = useAuth();
  const canManageQuotes = hasRole(['admin', 'ventas']);
  const canManageOrders = hasRole(['admin', 'ventas', 'almacen']);
  const [activeTab, setActiveTab] = useState<'cotizaciones' | 'pedidos'>('cotizaciones');
  const [quotes, setQuotes] = useState<Quote[]>(() => mockStore.getQuotes());
  const [orders, setOrders] = useState<Order[]>(() => mockStore.getOrders());

  const handleUpdateQuoteStatus = (id: string, status: Quote['status']) => {
    mockStore.updateQuoteStatus(id, status);
    setQuotes(mockStore.getQuotes());
    showToast(`Cotización actualizada a: ${status.toUpperCase()}`, 'info');
  };

  const handleConvertQuoteToSale = (quote: Quote) => {
    mockStore.addSale({
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerTaxId: '20519827361',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'confirmada',
      items: quote.items,
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      discountTotal: 0,
      total: quote.total,
      paymentMethod: 'Transferencia',
      notes: `Venta generada a partir de cotización aprobada ${quote.code}`,
      createdBy: 'Valeria Rivas',
    });

    mockStore.updateQuoteStatus(quote.id, 'convertida');
    setQuotes(mockStore.getQuotes());
    showToast(`Cotización ${quote.code} convertida en Venta oficial exitosamente`, 'success');
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    mockStore.updateOrderStatus(id, status);
    setOrders(mockStore.getOrders());
    showToast(`Estado de pedido actualizado a: ${status.toUpperCase()}`, 'info');
  };

  const quoteColumns: Column<Quote>[] = [
    {
      key: 'code',
      header: 'Cotización',
      sortable: true,
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      sortable: true,
      render: (row) => row.customerName,
    },
    {
      key: 'date',
      header: 'Fecha Emisión',
      sortable: true,
      render: (row) => formatDate(row.date),
    },
    {
      key: 'validUntil',
      header: 'Vigencia Hasta',
      sortable: true,
      render: (row) => formatDate(row.validUntil),
    },
    {
      key: 'total',
      header: 'Monto Total',
      sortable: true,
      align: 'right',
      render: (row) => <strong>{formatCurrency(row.total)}</strong>,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones de Flujo',
      align: 'right',
      render: (row) => {
        if (!canManageQuotes) {
          return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Solo lectura</span>;
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
            {row.status === 'enviada' && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Check size={13} color="var(--color-success)" />}
                onClick={() => handleUpdateQuoteStatus(row.id, 'aprobada')}
              >
                Aprobar
              </Button>
            )}
            {row.status === 'aprobada' && (
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={13} />}
                onClick={() => handleConvertQuoteToSale(row)}
              >
                Convertir a Venta
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const orderColumns: Column<Order>[] = [
    {
      key: 'code',
      header: 'Pedido',
      sortable: true,
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      sortable: true,
      render: (row) => row.customerName,
    },
    {
      key: 'priority',
      header: 'Prioridad',
      align: 'center',
      render: (row) => {
        let badgeClass = 'badge-neutral';
        if (row.priority === 'Urgente' || row.priority === 'Alta') badgeClass = 'badge-danger';
        if (row.priority === 'Media') badgeClass = 'badge-warning';
        return <span className={`status-badge ${badgeClass}`}>{row.priority}</span>;
      },
    },
    {
      key: 'deliveryDate',
      header: 'Fecha Entrega',
      sortable: true,
      render: (row) => formatDate(row.deliveryDate),
    },
    {
      key: 'total',
      header: 'Valor Pedido',
      sortable: true,
      align: 'right',
      render: (row) => <strong>{formatCurrency(row.total)}</strong>,
    },
    {
      key: 'status',
      header: 'Estado Logístico',
      sortable: true,
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (row) => {
        if (!canManageOrders) {
          return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Solo lectura</span>;
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
            {row.status === 'pendiente' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUpdateOrderStatus(row.id, 'en_proceso')}
              >
                En Proceso
              </Button>
            )}
            {row.status === 'en_proceso' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateOrderStatus(row.id, 'completado')}
              >
                Completar
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cotizaciones y Pedidos de Clientes"
        subtitle="Flujo previo a facturación: elaboración de propuestas, aprobaciones y despachos comprometidos."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Comercial' }, { label: 'Cotizaciones y Pedidos' }]}
      />

      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem',
          gap: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('cotizaciones')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'cotizaciones' ? 600 : 400,
            color: activeTab === 'cotizaciones' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'cotizaciones' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Cotizaciones ({quotes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pedidos')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'pedidos' ? 600 : 400,
            color: activeTab === 'pedidos' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'pedidos' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Pedidos en Curso ({orders.length})
        </button>
      </div>

      {activeTab === 'cotizaciones' ? (
        <DataTable
          columns={quoteColumns}
          data={quotes}
          keyExtractor={(q) => q.id}
          emptyTitle="No hay cotizaciones registradas"
        />
      ) : (
        <DataTable
          columns={orderColumns}
          data={orders}
          keyExtractor={(o) => o.id}
          emptyTitle="No hay pedidos registrados"
        />
      )}
    </div>
  );
};
