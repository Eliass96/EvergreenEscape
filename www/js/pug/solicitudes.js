function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function friendsRequest(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (solicitudes) {pug_html = pug_html + "\u003Coutput class=\"cardSolicitudes\" id=\"friendRequestsList\"\u003E";
if (solicitudes.length > 0) {
pug_html = pug_html + "\u003Cdiv class=\"d-flex align-items-center justify-content-center\"\u003E\u003Cul class=\"lista_friends w-100\"\u003E";
// iterate solicitudes
;(function(){
  var $$obj = solicitudes;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var solicitud = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"texto_friends d-flex align-items-center justify-content-between\"\u003E\u003Cp class=\"nombre_solicitud mb-0\"\u003E" + (pug_escape(null == (pug_interp = solicitud) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cdiv class=\"d-flex gap-2 ms-auto\"\u003E\u003Cbutton class=\"btn btn-custom boton_aceptar\" id=\"aceptar_solicitud\"\u003E✅\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-custom boton_rechazar\" id=\"rechazar_solicitud\"\u003E❌\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var solicitud = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"texto_friends d-flex align-items-center justify-content-between\"\u003E\u003Cp class=\"nombre_solicitud mb-0\"\u003E" + (pug_escape(null == (pug_interp = solicitud) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cdiv class=\"d-flex gap-2 ms-auto\"\u003E\u003Cbutton class=\"btn btn-custom boton_aceptar\" id=\"aceptar_solicitud\"\u003E✅\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-custom boton_rechazar\" id=\"rechazar_solicitud\"\u003E❌\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E";
}
else {
pug_html = pug_html + "\u003Cdiv class=\"text-no-solicitudes\"\u003E\u003Cp\u003ENo tienes solicitudes pendientes.\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Foutput\u003E";}.call(this,"solicitudes" in locals_for_with?locals_for_with.solicitudes:typeof solicitudes!=="undefined"?solicitudes:undefined));;return pug_html;}