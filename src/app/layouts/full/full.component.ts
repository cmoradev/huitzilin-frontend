import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  MatListSubheaderCssMatStyler,
  MatNavList,
} from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { concatMap, filter, groupBy, mergeMap, of, toArray, zip } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { NavItemComponent } from './sidebar/nav-item/nav-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GlobalStateSettingsComponent } from './global-state-settings/global-state-settings.component';
import { NavItem, navItems } from '@routes';
import { GlobalStateService } from '@services';
import { permissionMap, rootPermissions } from '@utils/permissions.data';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';

@Component({
  selector: 'app-full',
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    HeaderComponent,
    SidebarComponent,
    MatNavList,
    NavItemComponent,
    NgScrollbar,
    MatListSubheaderCssMatStyler,
    GlobalStateSettingsComponent,
  ],
  templateUrl: './full.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./full.component.scss'],
})
export class FullComponent {
  @ViewChild('leftsidenav') public sidenav!: MatSidenav;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;

  private readonly globalState = inject(GlobalStateService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  public isMobileScreen = signal(false);

  public navigations: NavItem[] = [];

  constructor() {
    this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW])
      .subscribe((state) => {
        this.isMobileScreen.set(state.breakpoints[MOBILE_VIEW]);
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.content.scrollTo({ top: 0 });
      });
    // Cambiar esto para que sea dinamico
    const username = this.globalState.session!.username;

    of(
      navItems
        .filter((item) => item.showInSidebar)
        .filter((item) => {
          if (permissionMap.has(username)) {
            const permissions = rootPermissions || [];

            return permissions.some((route) => route.route === item.route);
          }

          return false;
        })
    )
      .pipe(
        concatMap((res) => res),
        groupBy((item) => item.section),
        mergeMap((group) => zip(of(group.key), group.pipe(toArray())))
      )
      .subscribe((grouped) => {
        const [section, routes] = grouped;

        this.navigations.push({ section, routes });
      });
  }

  public get isOver(): boolean {
    return this.isMobileScreen();
  }
}
