import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'CineWave — Discover Cinema',
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/details/movie-details.component').then((m) => m.MovieDetailsComponent),
    title: 'CineWave — Movie',
  },
  {
    path: 'browse',
    loadComponent: () => import('./features/browse/browse.component').then((m) => m.BrowseComponent),
    title: 'CineWave — Browse',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then((m) => m.SearchComponent),
    title: 'CineWave — Search',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'CineWave — My List',
  },
  { path: '**', redirectTo: '' },
];
