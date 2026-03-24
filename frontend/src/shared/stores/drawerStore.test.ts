import { describe, it, expect, beforeEach } from 'vitest';
import { useDrawerStore } from './drawerStore';

describe('drawerStore', () => {
  beforeEach(() => {
    useDrawerStore.getState().closeDrawer();
  });

  it('has correct initial state', () => {
    const state = useDrawerStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.title).toBe('');
    expect(state.content).toBeNull();
    expect(state.width).toBeUndefined();
  });

  it('openDrawer sets isOpen to true with config', () => {
    useDrawerStore.getState().openDrawer({
      title: 'Detalhes',
      content: 'Conteúdo do drawer',
      width: '400px',
    });

    const state = useDrawerStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Detalhes');
    expect(state.content).toBe('Conteúdo do drawer');
    expect(state.width).toBe('400px');
  });

  it('openDrawer works without width', () => {
    useDrawerStore.getState().openDrawer({
      title: 'Sem largura',
      content: 'Conteúdo',
    });

    const state = useDrawerStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Sem largura');
    expect(state.width).toBeUndefined();
  });

  it('closeDrawer resets all state', () => {
    useDrawerStore.getState().openDrawer({
      title: 'Teste',
      content: 'Conteúdo',
      width: '500px',
    });
    useDrawerStore.getState().closeDrawer();

    const state = useDrawerStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.title).toBe('');
    expect(state.content).toBeNull();
    expect(state.width).toBeUndefined();
  });

  it('can open, close, and reopen with different config', () => {
    const store = useDrawerStore.getState();
    store.openDrawer({ title: 'First', content: 'A' });
    expect(useDrawerStore.getState().title).toBe('First');

    store.closeDrawer();
    expect(useDrawerStore.getState().isOpen).toBe(false);

    store.openDrawer({ title: 'Second', content: 'B', width: '600px' });
    const state = useDrawerStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Second');
    expect(state.width).toBe('600px');
  });
});
