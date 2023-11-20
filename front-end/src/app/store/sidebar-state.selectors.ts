import { createFeatureSelector } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export const selectSidebarState = createFeatureSelector<SidebarState>('sidebarState');

export const selectSidebarVisible = createFeatureSelector<boolean>('sidebarVisible');