(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{S2dX:function(t,n,o){"use strict";o.d(n,"a",(function(){return s}));var r=o("cUzu"),i=o("AytR"),e=o("TYT/"),s=function(){function t(t){this.http=t,this.url=i.a.api_despacho_agua+"profilepicture/",this.options={headers:null},this.options.headers=new r.c({api_token:sessionStorage.getItem("api_token")})}return t.prototype.get=function(t){var n=this;return this.http.get(this.url+"?user_id="+t.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.get_paginate=function(t,n){var o=this;return this.http.get(this.url+"paginate?size="+t.toString()+"&page="+n.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){o.handledError(t)}))},t.prototype.delete=function(t){var n=this;return this.http.delete(this.url+"?id="+t.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.post=function(t){var n=this;return this.http.post(this.url,JSON.stringify(t),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.put=function(t){var n=this;return this.http.put(this.url,JSON.stringify(t),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.handledError=function(t){console.log(t)},t.\u0275fac=function(n){return new(n||t)(e.Tb(r.a))},t.\u0275prov=e.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t}()},c4FF:function(t,n,o){"use strict";o.d(n,"a",(function(){return r}));var r=function(){return function(){}}()},teKj:function(t,n,o){"use strict";o.d(n,"a",(function(){return s}));var r=o("cUzu"),i=o("AytR"),e=o("TYT/"),s=function(){function t(t){this.http=t,this.url=i.a.api_despacho_agua+"user/",this.options={headers:null},this.options.headers=new r.c({api_token:sessionStorage.getItem("api_token")})}return t.prototype.get=function(t){var n=this;return void 0===t?this.http.get(this.url,this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)})):this.http.get(this.url+"?id="+t.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.get_paginate=function(t,n){var o=this;return this.http.get(this.url+"paginate?size="+t.toString()+"&page="+n.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){o.handledError(t)}))},t.prototype.delete=function(t){var n=this;return this.http.delete(this.url+"?id="+t.toString(),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.post=function(t){var n=this;return this.http.post(this.url,JSON.stringify(t),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.put=function(t){var n=this;return this.http.put(this.url,JSON.stringify(t),this.options).toPromise().then((function(t){return t})).catch((function(t){n.handledError(t)}))},t.prototype.handledError=function(t){console.log(t)},t.\u0275fac=function(n){return new(n||t)(e.Tb(r.a))},t.\u0275prov=e.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t}()},ytTt:function(t,n,o){"use strict";o.d(n,"a",(function(){return r}));var r=function(){return function(){this.id=0,this.file_type="",this.file="",this.file_name=""}}()}}]);