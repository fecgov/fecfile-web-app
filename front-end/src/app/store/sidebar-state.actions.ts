import { createAction, props } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export const setSidebarStateAction = createAction('[SidebarState] Save', props<{ payload?: SidebarState }>());
