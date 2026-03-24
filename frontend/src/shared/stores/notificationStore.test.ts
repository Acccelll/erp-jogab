import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useNotificationStore } from './notificationStore';

describe('notificationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useNotificationStore.getState().clearAll();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has correct initial state', () => {
    expect(useNotificationStore.getState().notifications).toEqual([]);
  });

  it('addNotification adds a notification with generated id', () => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title: 'Salvo com sucesso',
    });

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].title).toBe('Salvo com sucesso');
    expect(notifications[0].id).toBeTruthy();
  });

  it('addNotification supports optional message', () => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Erro',
      message: 'Falha ao salvar',
    });

    expect(useNotificationStore.getState().notifications[0].message).toBe('Falha ao salvar');
  });

  it('addNotification auto-removes after default duration', () => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Info',
    });

    expect(useNotificationStore.getState().notifications).toHaveLength(1);

    vi.advanceTimersByTime(5000);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('addNotification auto-removes after custom duration', () => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title: 'Aviso',
      duration: 2000,
    });

    vi.advanceTimersByTime(1999);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('addNotification with duration 0 does not auto-remove', () => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Permanente',
      duration: 0,
    });

    vi.advanceTimersByTime(60000);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });

  it('removeNotification removes specific notification', () => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title: 'First',
      duration: 0,
    });
    useNotificationStore.getState().addNotification({
      type: 'error',
      title: 'Second',
      duration: 0,
    });

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications).toHaveLength(2);

    const firstId = notifications[0].id;
    useNotificationStore.getState().removeNotification(firstId);

    const remaining = useNotificationStore.getState().notifications;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].title).toBe('Second');
  });

  it('clearAll removes all notifications', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'A', duration: 0 });
    useNotificationStore.getState().addNotification({ type: 'info', title: 'B', duration: 0 });
    useNotificationStore.getState().addNotification({ type: 'info', title: 'C', duration: 0 });

    useNotificationStore.getState().clearAll();
    expect(useNotificationStore.getState().notifications).toEqual([]);
  });

  it('each notification gets a unique id', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'A', duration: 0 });
    useNotificationStore.getState().addNotification({ type: 'info', title: 'B', duration: 0 });

    const notifications = useNotificationStore.getState().notifications;
    expect(notifications[0].id).not.toBe(notifications[1].id);
  });

  it('removeNotification with non-existent id does nothing', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'A', duration: 0 });
    useNotificationStore.getState().removeNotification('non-existent-id');
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });
});
