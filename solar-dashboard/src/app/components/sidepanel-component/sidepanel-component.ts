import { Component } from '@angular/core';
import { MatSidenavModule, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidepanel-component',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './sidepanel-component.html',
  styleUrl: './sidepanel-component.scss',
})

export class SidepanelComponent {}
