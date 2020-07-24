import { watherRequestModule } from './watherrequest.module';

describe('watherRequestModule', () => {
   let blackPageModule: watherRequestModule;

   beforeEach(() => {
      blackPageModule = new watherRequestModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});