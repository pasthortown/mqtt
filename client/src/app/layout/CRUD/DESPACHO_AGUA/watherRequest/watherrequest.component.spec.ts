import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { watherRequestComponent } from './watherrequest.component';

describe('watherRequestComponent', () => {
   let component: watherRequestComponent;
   let fixture: ComponentFixture<watherRequestComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [watherRequestComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(watherRequestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});