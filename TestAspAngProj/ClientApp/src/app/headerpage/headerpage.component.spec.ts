import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderpageComponent } from './headerpage.component';

describe('HeaderpageComponent', () => {
  let component: HeaderpageComponent;
  let fixture: ComponentFixture<HeaderpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
