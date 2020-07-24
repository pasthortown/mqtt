export class watherRequest {
   id: number;
   code: String;
   quantity: number;
   activo: Boolean;
   user_id: number;

   constructor() {
      this.activo = true;
   }
}