// Códigos de tecla do comando LG (webOS) + teclado (para testes no browser)
export type Action = 'left' | 'right' | 'up' | 'down' | 'ok' | 'back' | 'play' | 'pause' | 'playpause' | 'stop' | 'ff' | 'rw' | 'red' | 'green' | 'yellow' | 'blue' | 'chUp' | 'chDown';

const MAP: Record<number, Action> = {
  37: 'left', 38: 'up', 39: 'right', 40: 'down',
  13: 'ok',
  461: 'back', 27: 'back', 8: 'back', 10009: 'back',
  415: 'play', 19: 'pause', 179: 'playpause', 413: 'stop', 417: 'ff', 412: 'rw',
  403: 'red', 404: 'green', 405: 'yellow', 406: 'blue',
  427: 'chUp', 428: 'chDown', 33: 'chUp', 34: 'chDown',
};

export const actionFromKey = (e: KeyboardEvent): Action | undefined => MAP[e.keyCode];
