import { Injectable } from '@angular/core';

/**
 * TVMaze returns absolute image URLs, so this service simply passes them through
 * (the size argument is accepted for call-site symmetry but ignored).
 */
@Injectable({ providedIn: 'root' })
export class ImageService {
  poster(path: string | null, _size = ''): string | null {
    return path;
  }
  backdrop(path: string | null, _size = ''): string | null {
    return path;
  }
  profile(path: string | null, _size = ''): string | null {
    return path;
  }
}
