import * as L from 'leaflet';

export const lostIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIgMkM3LjU4IDIgNCA1LjU4IDQgMTBjMCA1LjI1IDUuOTIgMTEuNzQgNy40NCAxMy4zM2ExIDEgMCAwIDAgMS4xMiAwQzE0LjA4IDIxLjc0IDIwIDE1LjI1IDIwIDEwYzAtNC40Mi0zLjU4LTgtOC04eiIgZmlsbD0icmVkIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

export const foundIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIgMkM3LjU4IDIgNCA1LjU4IDQgMTBjMCA1LjI1IDUuOTIgMTEuNzQgNy40NCAxMy4zM2ExIDEgMCAwIDAgMS4xMiAwQzE0LjA4IDIxLjc0IDIwIDE1LjI1IDIwIDEwYzAtNC40Mi0zLjU4LTgtOC04eiIgZmlsbD0iYmx1ZSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

export const defaultIcon = lostIcon;
